#!/usr/bin/env python3
"""Test FastAPI endpoints."""

import requests
import json

def test_api():
    """Test API endpoints."""
    base_url = "http://localhost:8000"

    print("=" * 60)
    print("TESTING FASTAPI ENDPOINTS")
    print("=" * 60)

    # Test root endpoint
    print("\n1. Testing root endpoint (/):")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"   FAILED: {e}")

    # Test health endpoint
    print("\n2. Testing health endpoint (/health):")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   FAILED: {e}")

    # Test signals endpoint
    print("\n3. Testing signals endpoint (/api/v1/signals):")
    try:
        response = requests.get(f"{base_url}/api/v1/signals?limit=5")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Signal count: {data.get('count', 0)}")
        if data.get('signals'):
            print(f"   First signal category: {data['signals'][0]['category']}")
    except Exception as e:
        print(f"   FAILED: {e}")

    # Test API docs
    print("\n4. API Documentation:")
    print(f"   Swagger UI: {base_url}/docs")
    print(f"   ReDoc: {base_url}/redoc")

    print("\n" + "=" * 60)
    print("API TEST COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    test_api()