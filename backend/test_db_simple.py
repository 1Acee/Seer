#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def test_connection(db_url):
    print(f"Testing connection: {db_url.replace('postgres:', '***:')}")
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version[0][:50]}...")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

# Test with localhost
localhost_url = os.getenv("DATABASE_URL")
print("\n1. Testing with localhost:")
localhost_success = test_connection(localhost_url)

# Test with Windows host IP
if not localhost_success:
    print("\n2. Testing with Windows host IP (10.255.255.254):")
    windows_url = localhost_url.replace("localhost", "10.255.255.254")
    windows_success = test_connection(windows_url)

    if windows_success:
        print("\n✅ Windows host IP works! Updating .env file...")
        with open('.env', 'r') as f:
            content = f.read()
        new_content = content.replace("localhost", "10.255.255.254")
        with open('.env', 'w') as f:
            f.write(new_content)
        print("✅ .env file updated with Windows host IP")
else:
    print("\n✅ localhost connection works fine!")