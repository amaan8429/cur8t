"""
Subscription service for enforcing plan limits in the extension API.
This service checks user subscription status and enforces limits on collections, links, favorites, etc.
"""

import logging
from typing import Dict, Any, Optional, Tuple
from .database import execute_query_one, execute_query_all
from .config import settings

logger = logging.getLogger(__name__)

class SubscriptionService:
    """Service for managing subscription limits and enforcement"""
    
    @staticmethod
    async def get_user_subscription(user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user's current subscription plan and limits.
        Returns None if user has no active subscription (defaults to Free plan).
        """
        logger.info(f"🔍 GET_USER_SUBSCRIPTION - Called for user: {user_id}")
        
        try:
            # First check if user has an active subscription
            logger.info(f"🔍 Checking for active subscriptions...")
            subscription_query = """
                SELECT s.product_id, s.variant_id, s.status, s.created_at
                FROM subscriptions s
                WHERE s.user_id = $1 AND s.status IN ('active', 'trialing')
                ORDER BY s.created_at DESC
                LIMIT 1
            """
            
            logger.info(f"🔍 Subscription query: {subscription_query}")
            logger.info(f"🔍 Query params: user_id={user_id}")
            
            subscription = await execute_query_one(subscription_query, (user_id,))
            logger.info(f"🔍 Subscription query result: {subscription}")
            
            if subscription:
                logger.info(f"✅ Found active subscription: {subscription}")
                # User has active subscription, get plan details
                plan_query = """
                    SELECT id, name, slug, interval, price_cents, limits
                    FROM plans
                    WHERE product_id = $1 OR variant_id = $2
                    LIMIT 1
                """
                
                logger.info(f"🔍 Plan query: {plan_query}")
                logger.info(f"🔍 Plan query params: product_id={subscription['product_id']}, variant_id={subscription['variant_id']}")
                
                plan = await execute_query_one(
                    plan_query, 
                    (subscription['product_id'], subscription['variant_id'])
                )
                
                logger.info(f"🔍 Plan query result: {plan}")
                
                if plan and plan.get('limits'):
                    logger.info(f"✅ Found plan with limits: {plan['name']} ({plan['slug']})")
                    return {
                        'plan_id': plan['id'],
                        'plan_name': plan['name'],
                        'plan_slug': plan['slug'],
                        'interval': plan['interval'],
                        'price_cents': plan['price_cents'],
                        'limits': plan['limits'],
                        'subscription_status': subscription['status']
                    }
                else:
                    logger.warning(f"⚠️ Plan found but no limits: {plan}")
            
            # Fallback to Free plan
            logger.info(f"🔍 No active subscription found, checking for free plan...")
            free_plan_query = """
                SELECT id, name, slug, interval, price_cents, limits
                FROM plans
                WHERE slug = 'free'
                LIMIT 1
            """
            
            logger.info(f"🔍 Free plan query: {free_plan_query}")
            free_plan = await execute_query_one(free_plan_query)
            logger.info(f"🔍 Free plan query result: {free_plan}")
            
            if free_plan and free_plan.get('limits'):
                logger.info(f"✅ Found free plan with limits: {free_plan['name']} ({free_plan['slug']})")
                return {
                    'plan_id': free_plan['id'],
                    'plan_name': free_plan['name'],
                    'plan_slug': free_plan['slug'],
                    'interval': 'none',
                    'price_cents': 0,
                    'limits': free_plan['limits'],
                    'subscription_status': 'free'
                }
            
            # Hard fallback if no plans exist
            logger.warning(f"⚠️ No plans found in database for user {user_id}, using hardcoded defaults")
            hardcoded_plan = {
                'plan_id': 'free',
                'plan_name': 'Free',
                'plan_slug': 'free',
                'interval': 'none',
                'price_cents': 0,
                'limits': {
                    'collections': 3,
                    'linksPerCollection': 50,
                    'totalLinks': 150,
                    'favorites': 5,
                    'topCollections': 3
                },
                'subscription_status': 'free'
            }
            logger.info(f"✅ Returning hardcoded plan: {hardcoded_plan}")
            return hardcoded_plan
            
        except Exception as e:
            logger.error(f"❌ Error getting user subscription for {user_id}: {str(e)}")
            logger.error(f"❌ Exception type: {type(e)}")
            import traceback
            logger.error(f"❌ Full traceback: {traceback.format_exc()}")
            
            # Return hardcoded defaults on error
            hardcoded_plan = {
                'plan_id': 'free',
                'plan_name': 'Free',
                'plan_slug': 'free',
                'interval': 'none',
                'price_cents': 0,
                'limits': {
                    'collections': 3,
                    'linksPerCollection': 50,
                    'totalLinks': 150,
                    'favorites': 5,
                    'topCollections': 3
                },
                'subscription_status': 'free'
            }
            logger.info(f"✅ Returning hardcoded plan on error: {hardcoded_plan}")
            return hardcoded_plan
    
    @staticmethod
    async def get_user_usage(user_id: str) -> Dict[str, int]:
        """Get current usage counts for a user"""
        logger.info(f"🔍 GET_USER_USAGE - Called for user: {user_id}")
        
        try:
            # Get collections count
            logger.info(f"🔍 Getting collections count...")
            collections_query = """
                SELECT COUNT(*) as count
                FROM collections
                WHERE user_id = $1
            """
            logger.info(f"🔍 Collections query: {collections_query}")
            logger.info(f"🔍 Query params: user_id={user_id}")
            
            collections_result = await execute_query_one(collections_query, (user_id,))
            logger.info(f"🔍 Collections query result: {collections_result}")
            
            collections_count = collections_result['count'] if collections_result else 0
            logger.info(f"✅ Collections count: {collections_count}")
            
            # Get total links count
            logger.info(f"🔍 Getting total links count...")
            links_query = """
                SELECT COUNT(*) as count
                FROM links
                WHERE user_id = $1
            """
            logger.info(f"🔍 Links query: {links_query}")
            logger.info(f"🔍 Query params: user_id={user_id}")
            
            links_result = await execute_query_one(links_query, (user_id,))
            logger.info(f"🔍 Links query result: {links_result}")
            
            total_links_count = links_result['count'] if links_result else 0
            logger.info(f"✅ Total links count: {total_links_count}")
            
            # Get favorites count
            logger.info(f"🔍 Getting favorites count...")
            favorites_query = """
                SELECT COUNT(*) as count
                FROM favorites
                WHERE user_id = $1
            """
            logger.info(f"🔍 Favorites query: {favorites_query}")
            logger.info(f"🔍 Query params: user_id={user_id}")
            
            favorites_result = await execute_query_one(favorites_query, (user_id,))
            logger.info(f"🔍 Favorites query result: {favorites_result}")
            
            favorites_count = favorites_result['count'] if favorites_result else 0
            logger.info(f"✅ Favorites count: {favorites_count}")
            
            # Get top collections count
            logger.info(f"🔍 Getting top collections count...")
            top_collections_query = """
                SELECT top_collections
                FROM users
                WHERE id = $1
            """
            logger.info(f"🔍 Top collections query: {top_collections_query}")
            logger.info(f"🔍 Query params: user_id={user_id}")
            
            top_collections_result = await execute_query_one(top_collections_query, (user_id,))
            logger.info(f"🔍 Top collections query result: {top_collections_result}")
            
            top_collections_count = len(top_collections_result['top_collections']) if top_collections_result and top_collections_result['top_collections'] else 0
            logger.info(f"✅ Top collections count: {top_collections_count}")
            
            usage_summary = {
                'collections': collections_count,
                'totalLinks': total_links_count,
                'favorites': favorites_count,
                'topCollections': top_collections_count
            }
            
            logger.info(f"🎉 Usage summary: {usage_summary}")
            return usage_summary
            
        except Exception as e:
            logger.error(f"❌ Error getting user usage for {user_id}: {str(e)}")
            logger.error(f"❌ Exception type: {type(e)}")
            import traceback
            logger.error(f"❌ Full traceback: {traceback.format_exc()}")
            
            # Return zeros on error
            fallback_usage = {
                'collections': 0,
                'totalLinks': 0,
                'favorites': 0,
                'topCollections': 0
            }
            logger.info(f"✅ Returning fallback usage on error: {fallback_usage}")
            return fallback_usage
    
    @staticmethod
    async def check_collection_limit(user_id: str) -> Tuple[bool, str, Optional[str]]:
        """
        Check if user can create more collections.
        Returns (can_create, error_message, plan_slug)
        """
        try:
            subscription = await SubscriptionService.get_user_subscription(user_id)
            if not subscription:
                return False, "Unable to determine subscription status", None
            
            usage = await SubscriptionService.get_user_usage(user_id)
            limits = subscription['limits']
            
            if usage['collections'] >= limits['collections']:
                return False, f"Collection limit reached ({limits['collections']}). Upgrade your plan to create more.", subscription['plan_slug']
            
            return True, "", subscription['plan_slug']
            
        except Exception as e:
            logger.error(f"Error checking collection limit for user {user_id}: {str(e)}")
            return False, "Error checking subscription limits", None
    
    @staticmethod
    async def check_links_limit(user_id: str, collection_id: str, links_to_add: int = 1) -> Tuple[bool, str, Optional[str]]:
        """
        Check if user can add more links to a collection.
        Returns (can_add, error_message, plan_slug)
        """
        logger.info(f"🔍 CHECK_LINKS_LIMIT - Called for user: {user_id}, collection: {collection_id}, links_to_add: {links_to_add}")
        
        try:
            logger.info(f"🔍 Getting user subscription...")
            subscription = await SubscriptionService.get_user_subscription(user_id)
            if not subscription:
                logger.error(f"❌ No subscription found for user: {user_id}")
                return False, "Unable to determine subscription status", None
            
            logger.info(f"✅ Subscription found: {subscription['plan_name']} ({subscription['plan_slug']})")
            logger.info(f"✅ Subscription limits: {subscription['limits']}")
            
            logger.info(f"🔍 Getting user usage...")
            usage = await SubscriptionService.get_user_usage(user_id)
            logger.info(f"✅ User usage: {usage}")
            
            limits = subscription['limits']
            logger.info(f"✅ Plan limits: {limits}")
            
            # Check per-collection limit
            logger.info(f"🔍 Checking per-collection limit...")
            collection_links_query = """
                SELECT COUNT(*) as count
                FROM links
                WHERE link_collection_id = $1
            """
            
            logger.info(f"🔍 Collection links query: {collection_links_query}")
            logger.info(f"🔍 Query params: collection_id={collection_id}")
            
            collection_links_result = await execute_query_one(collection_links_query, (collection_id,))
            logger.info(f"🔍 Collection links query result: {collection_links_result}")
            
            current_collection_links = collection_links_result['count'] if collection_links_result else 0
            logger.info(f"🔍 Current collection links: {current_collection_links}")
            logger.info(f"🔍 Links to add: {links_to_add}")
            logger.info(f"🔍 Per-collection limit: {limits['linksPerCollection']}")
            logger.info(f"🔍 Will exceed limit: {current_collection_links + links_to_add > limits['linksPerCollection']}")
            
            if current_collection_links + links_to_add > limits['linksPerCollection']:
                error_msg = f"Links per collection limit reached ({limits['linksPerCollection']}). Upgrade your plan to add more links."
                logger.warning(f"⚠️ Per-collection limit exceeded: {error_msg}")
                return False, error_msg, subscription['plan_slug']
            
            logger.info(f"✅ Per-collection limit check passed")
            
            # Check total links limit
            logger.info(f"🔍 Checking total links limit...")
            logger.info(f"🔍 Current total links: {usage['totalLinks']}")
            logger.info(f"🔍 Links to add: {links_to_add}")
            logger.info(f"🔍 Total links limit: {limits['totalLinks']}")
            logger.info(f"🔍 Will exceed limit: {usage['totalLinks'] + links_to_add > limits['totalLinks']}")
            
            if usage['totalLinks'] + links_to_add > limits['totalLinks']:
                error_msg = f"Total links limit reached ({limits['totalLinks']}). Upgrade your plan to add more links."
                logger.warning(f"⚠️ Total links limit exceeded: {error_msg}")
                return False, error_msg, subscription['plan_slug']
            
            logger.info(f"✅ Total links limit check passed")
            logger.info(f"🎉 All subscription limit checks passed successfully!")
            
            return True, "", subscription['plan_slug']
            
        except Exception as e:
            logger.error(f"❌ Error checking links limit for user {user_id}: {str(e)}")
            logger.error(f"❌ Exception type: {type(e)}")
            import traceback
            logger.error(f"❌ Full traceback: {traceback.format_exc()}")
            return False, "Error checking subscription limits", None
    
    @staticmethod
    async def check_favorites_limit(user_id: str) -> Tuple[bool, str, Optional[str]]:
        """
        Check if user can add more favorites.
        Returns (can_add, error_message, plan_slug)
        """
        try:
            subscription = await SubscriptionService.get_user_subscription(user_id)
            if not subscription:
                return False, "Unable to determine subscription status", None
            
            usage = await SubscriptionService.get_user_usage(user_id)
            limits = subscription['limits']
            
            if usage['favorites'] >= limits['favorites']:
                return False, f"Favorites limit reached ({limits['favorites']}). Upgrade your plan to add more favorites.", subscription['plan_slug']
            
            return True, "", subscription['plan_slug']
            
        except Exception as e:
            logger.error(f"Error checking favorites limit for user {user_id}: {str(e)}")
            return False, "Error checking subscription limits", None
    
    @staticmethod
    async def check_top_collections_limit(user_id: str, collections_to_add: int = 1) -> Tuple[bool, str, Optional[str]]:
        """
        Check if user can add more top collections.
        Returns (can_add, error_message, plan_slug)
        """
        try:
            subscription = await SubscriptionService.get_user_subscription(user_id)
            if not subscription:
                return False, "Unable to determine subscription status", None
            
            usage = await SubscriptionService.get_user_usage(user_id)
            limits = subscription['limits']
            
            if usage['topCollections'] + collections_to_add > limits['topCollections']:
                return False, f"Top collections limit reached ({limits['topCollections']}). Upgrade your plan to add more pinned collections.", subscription['plan_slug']
            
            return True, "", subscription['plan_slug']
            
        except Exception as e:
            logger.error(f"Error checking top collections limit for user {user_id}: {str(e)}")
            return False, "Error checking subscription limits", None

# Global instance
subscription_service = SubscriptionService()
