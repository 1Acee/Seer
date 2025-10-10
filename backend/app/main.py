from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.signal import RawSignal
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title="Seer Prediction Engine API",
    description="Trend detection and prediction backend",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Seer API started successfully")
    print(f"Environment: {settings.ENV}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")

@app.get("/")
async def root():
    return {
        "message": "Seer Prediction Engine API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/signals")
def get_signals(
    limit: int = 20,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Get raw signals from database."""
    query = db.query(RawSignal)
    
    if category:
        query = query.filter(RawSignal.category == category)
    
    signals = query.order_by(RawSignal.collected_at.desc()).limit(limit).all()
    
    return {
        "count": len(signals),
        "signals": [
            {
                "id": s.id,
                "platform": s.platform,
                "category": s.category,
                "title": s.title,
                "metric_value": s.metric_value,
                "collected_at": s.collected_at.isoformat(),
            }
            for s in signals
        ]
    }