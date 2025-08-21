#!/usr/bin/env python3
"""
Simple test script for the subscription service.
Run this to verify the subscription service works correctly.
"""

import asyncio
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

async def test_subscription_service():
    """Test the subscription service functions"""
    try:
        from app.core.subscription import subscription_service
        
        print("✅ Successfully imported subscription service")
        
        # Test with a dummy user ID
        test_user_id = "test-user-123"
        
        print(f"\n🔍 Testing subscription service with user ID: {test_user_id}")
        
        # Test getting user subscription
        print("\n1. Testing get_user_subscription...")
        subscription = await subscription_service.get_user_subscription(test_user_id)
        if subscription:
            print(f"   ✅ Subscription retrieved: {subscription['plan_name']} ({subscription['plan_slug']})")
            print(f"   📊 Limits: {subscription['limits']}")
        else:
            print("   ❌ Failed to get subscription")
        
        # Test getting user usage
        print("\n2. Testing get_user_usage...")
        usage = await subscription_service.get_user_usage(test_user_id)
        if usage:
            print(f"   ✅ Usage retrieved: {usage}")
        else:
            print("   ❌ Failed to get usage")
        
        # Test checking collection limit
        print("\n3. Testing check_collection_limit...")
        can_create, error_msg, plan_slug = await subscription_service.check_collection_limit(test_user_id)
        print(f"   ✅ Can create collections: {can_create}")
        if not can_create:
            print(f"   📝 Error message: {error_msg}")
            print(f"   🎯 Plan slug: {plan_slug}")
        
        # Test checking links limit
        print("\n4. Testing check_links_limit...")
        can_add, error_msg, plan_slug = await subscription_service.check_links_limit(test_user_id, "test-collection-123", 5)
        print(f"   ✅ Can add 5 links: {can_add}")
        if not can_add:
            print(f"   📝 Error message: {error_msg}")
            print(f"   🎯 Plan slug: {plan_slug}")
        
        # Test checking favorites limit
        print("\n5. Testing check_favorites_limit...")
        can_add, error_msg, plan_slug = await subscription_service.check_favorites_limit(test_user_id)
        print(f"   ✅ Can add favorites: {can_add}")
        if not can_add:
            print(f"   📝 Error message: {error_msg}")
            print(f"   🎯 Plan slug: {plan_slug}")
        
        # Test checking top collections limit
        print("\n6. Testing check_top_collections_limit...")
        can_add, error_msg, plan_slug = await subscription_service.check_top_collections_limit(test_user_id, 2)
        print(f"   ✅ Can add 2 top collections: {can_add}")
        if not can_add:
            print(f"   📝 Error message: {error_msg}")
            print(f"   🎯 Plan slug: {plan_slug}")
        
        print("\n🎉 All tests completed successfully!")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running this from the extension-api directory")
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Testing Extension API Subscription Service")
    print("=" * 50)
    
    # Run the async test
    asyncio.run(test_subscription_service())
