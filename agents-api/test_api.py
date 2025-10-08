#!/usr/bin/env python3
"""
Simple test script for the Article Link Extractor API
"""

import json

import requests


def test_article_extractor():
    """Test the Article Link Extractor agent"""

    # API endpoint (updated to match new structure)
    url = "http://localhost:8000/agents/article-extractor/"

    # Test data
    test_data = {
        "article_url": "https://medium.com/the-andela-way/graph-databases-why-are-they-important-c438e1a224ae",  # Replace with a real article URL for testing
        "collection_name": "Test Collection from API",
    }

    try:
        print("🧪 Testing Article Link Extractor...")
        print(f"📝 Request data: {json.dumps(test_data, indent=2)}")

        # Make request
        response = requests.post(url, json=test_data)

        print(f"📊 Response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Success!")
            print(f"📄 Article title: {result.get('article_title', 'N/A')}")
            print(f"🔗 Links found: {result.get('total_links_found', 0)}")
            print(f"📚 Collection name: {result.get('collection_name', 'N/A')}")

            # Show first few links
            links = result.get("extracted_links", [])
            if links:
                print("\n🔗 Sample extracted links:")
                for i, link in enumerate(links[:3]):
                    print(
                        f"  {i+1}. {link.get('title', 'No title')} - {link.get('url', 'No URL')}"
                    )

                if len(links) > 3:
                    print(f"  ... and {len(links) - 3} more links")
        else:
            print("❌ Error!")
            print(f"📝 Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print(
            "❌ Connection failed! Make sure the API server is running on localhost:8000"
        )
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


def test_health_check():
    """Test the health check endpoint"""
    try:
        print("\n🏥 Testing health check...")
        response = requests.get("http://localhost:8000/agents/article-extractor/health")

        if response.status_code == 200:
            result = response.json()
            print("✅ Health check passed!")
            print(f"📝 Agent: {result.get('agent', 'N/A')}")
            print(f"📊 Status: {result.get('status', 'N/A')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")

    except requests.exceptions.ConnectionError:
        print(
            "❌ Connection failed! Make sure the API server is running on localhost:8000"
        )
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    print("🚀 Cur8t Agents API Test")
    print("=" * 40)

    # Test health check first
    test_health_check()

    # Test main functionality
    test_article_extractor()

    print("\n✨ Test completed!")
