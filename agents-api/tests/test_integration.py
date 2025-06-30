"""
Integration tests for the Cur8t Agents API
"""

import requests
from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "agents" in data
    assert isinstance(data["agents"], list)

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data

def test_article_extractor_health():
    """Test article extractor health endpoint"""
    response = client.get("/agents/article-extractor/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["agent"] == "Article Link Extractor"
    assert data["status"] == "healthy"

def test_article_extractor_endpoint():
    """Test article extractor with a mock request"""
    test_data = {
        "article_url": "https://httpbin.org/html",  # Simple test HTML page
        "collection_name": "Integration Test Collection"
    }
    
    response = client.post("/agents/article-extractor/", json=test_data)
    
    # Should get either success or network error (both are acceptable for integration test)
    assert response.status_code in [200, 500]  # 500 might occur due to network issues in test env
    
    if response.status_code == 200:
        data = response.json()
        assert data["success"] is True
        assert "extracted_links" in data
        assert "collection_name" in data

def test_invalid_article_url():
    """Test article extractor with invalid URL"""
    test_data = {
        "article_url": "not-a-valid-url",
        "collection_name": "Test Collection"
    }
    
    response = client.post("/agents/article-extractor/", json=test_data)
    assert response.status_code == 422  # Validation error from FastAPI 