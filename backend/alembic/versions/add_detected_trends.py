"""
Alembic migration: Add detected_trends table for micro-trend tracking

Revision ID: add_detected_trends
Revises: (your_previous_revision)
Create Date: 2025-10-10
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'add_detected_trends'
down_revision = None  # Update this with your current revision ID
branch_labels = None
depends_on = None


def upgrade():
    # Create detected_trends table
    op.create_table(
        'detected_trends',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('trend_phrase', sa.String(200), nullable=False, comment='The detected trend phrase (e.g., "Glass Skin Routine")'),
        sa.Column('normalized_phrase', sa.String(200), nullable=False, comment='Normalized version for deduplication'),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True, comment='List of associated keywords'),
        sa.Column('hashtags', postgresql.JSON(astext_type=sa.Text()), nullable=True, comment='List of associated hashtags'),
        sa.Column('signal_count', sa.Integer(), default=0, comment='Number of signals containing this trend'),
        sa.Column('first_seen', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('last_seen', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_validated', sa.Boolean(), default=False, comment='Whether this has been promoted to full trend'),
        sa.Column('promoted_trend_id', sa.Integer(), nullable=True, comment='ID of trend this was promoted to'),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True, comment='Additional NLP metadata'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for fast lookups
    op.create_index('ix_detected_trends_id', 'detected_trends', ['id'])
    op.create_index('ix_detected_trends_category', 'detected_trends', ['category'])
    op.create_index('ix_detected_trends_normalized_phrase', 'detected_trends', ['normalized_phrase'])
    op.create_index('ix_detected_trends_signal_count', 'detected_trends', ['signal_count'])
    op.create_index('idx_category_signal_count', 'detected_trends', ['category', 'signal_count'])
    op.create_index('idx_validated', 'detected_trends', ['is_validated'])
    
    # Add foreign key to trends table
    op.create_foreign_key(
        'detected_trends_promoted_trend_id_fkey',
        'detected_trends', 'trends',
        ['promoted_trend_id'], ['id']
    )
    
    # Create signal_trend_associations junction table (many-to-many)
    op.create_table(
        'signal_trend_associations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('signal_id', sa.Integer(), nullable=False),
        sa.Column('detected_trend_id', sa.Integer(), nullable=False),
        sa.Column('relevance_score', sa.Float(), default=0.0, comment='How relevant is this signal to this trend (0-1)'),
        sa.Column('extraction_method', sa.String(50), nullable=True, comment='How was this association detected (tfidf, hashtag, etc)'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for junction table
    op.create_index('ix_signal_trend_assoc_id', 'signal_trend_associations', ['id'])
    op.create_index('ix_signal_trend_assoc_signal_id', 'signal_trend_associations', ['signal_id'])
    op.create_index('ix_signal_trend_assoc_trend_id', 'signal_trend_associations', ['detected_trend_id'])
    op.create_index('idx_signal_trend_unique', 'signal_trend_associations', ['signal_id', 'detected_trend_id'], unique=True)
    op.create_index('idx_trend_relevance', 'signal_trend_associations', ['detected_trend_id', 'relevance_score'])
    
    # Add foreign keys for junction table
    op.create_foreign_key(
        'signal_trend_assoc_signal_id_fkey',
        'signal_trend_associations', 'raw_signals',
        ['signal_id'], ['id']
    )
    op.create_foreign_key(
        'signal_trend_assoc_detected_trend_id_fkey',
        'signal_trend_associations', 'detected_trends',
        ['detected_trend_id'], ['id']
    )


def downgrade():
    # Drop foreign keys first
    op.drop_constraint('signal_trend_assoc_detected_trend_id_fkey', 'signal_trend_associations', type_='foreignkey')
    op.drop_constraint('signal_trend_assoc_signal_id_fkey', 'signal_trend_associations', type_='foreignkey')
    op.drop_constraint('detected_trends_promoted_trend_id_fkey', 'detected_trends', type_='foreignkey')
    
    # Drop tables
    op.drop_table('signal_trend_associations')
    op.drop_table('detected_trends')