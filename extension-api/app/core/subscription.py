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
        try:
            # First check if user has an active subscription
            subscription_query = """
                SELECT s.product_id, s.variant_id, s.status, s.created_at
                FROM subscriptions s
                WHERE s.user_id = $1 AND s.status IN ('active', 'trialing')
                ORDER BY s.created_at DESC
                LIMIT 1
            """
            
            subscription = await execute_query_one(subscription_query, (user_id,))
            
            if subscription:
                # User has active subscription, get plan details
                plan_query = """
                    SELECT id, name, slug, interval, price_cents, limits
                    FROM plans
                    WHERE product_id = $1 OR variant_id = $2
                    LIMIT 1
                """
                
                plan = await execute_query_one(
                    plan_query, 
                    (subscription['product_id'], subscription['variant_id'])
                )
                
                if plan and plan.get('limits'):
                    return {
                        'plan_id': plan['id'],
                        'plan_name': plan['name'],
                        'plan_slug': plan['slug'],
                        'interval': plan['interval'],
                        'price_cents': plan['price_cents'],
                        'limits': plan['limits'],
                        'subscription_status': subscription['status']
                    }
            
            # Fallback to Free plan
            free_plan_query = """
                SELECT id, name, slug, interval, price_cents, limits
                FROM plans
                WHERE slug = 'free'
                LIMIT 1
            """
            
            free_plan = await execute_query_one(free_plan_query)
            if free_plan and free_plan.get('limits'):
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
            logger.warning(f"No plans found in database for user {user_id}, using hardcoded defaults")
            return {
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
            
        except Exception as e:
            logger.error(f"Error getting user subscription for {user_id}: {str(e)}")
            # Return hardcoded defaults on error
            return {
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
    
    @staticmethod
    async def get_user_usage(user_id: str) -> Dict[str, int]:
        """Get current usage counts for a user"""
        try:
            # Get collections count
            collections_query = """
                SELECT COUNT(*) as count
                FROM collections
                WHERE user_id = $1
            """
            collections_result = await execute_query_one(collections_query, (user_id,))
            collections_count = collections_result['count'] if collections_result else 0
            
            # Get total links count
            links_query = """
                SELECT COUNT(*) as count
                FROM links
                WHERE user_id = $1
            """
            links_result = await execute_query_one(links_query, (user_id,))
            total_links_count = links_result['count'] if links_result else 0
            
            # Get favorites count
            favorites_query = """
                SELECT COUNT(*) as count
                FROM favorites
                WHERE user_id = $1
            """
            favorites_result = await execute_query_one(favorites_query, (user_id,))
            favorites_count = favorites_result['count'] if favorites_result else 0
            
            # Get top collections count
            top_collections_query = """
                SELECT top_collections
                FROM users
                WHERE id = $1
            """
            top_collections_result = await execute_query_one(top_collections_query, (user_id,))
            top_collections_count = len(top_collections_result['top_collections']) if top_collections_result and top_collections_result['top_collections'] else 0
            
            return {
                'collections': collections_count,
                'totalLinks': total_links_count,
                'favorites': favorites_count,
                'topCollections': top_collections_count
            }
            
        except Exception as e:
            logger.error(f"Error getting user usage for {user_id}: {str(e)}")
            return {
                'collections': 0,
                'totalLinks': 0,
                'favorites': 0,
                'topCollections': 0
            }
    
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
        try:
            subscription = await SubscriptionService.get_user_subscription(user_id)
            if not subscription:
                return False, "Unable to determine subscription status", None
            
            usage = await SubscriptionService.get_user_usage(user_id)
            limits = subscription['limits']
            
            # Check per-collection limit
            collection_links_query = """
                SELECT COUNT(*) as count
                FROM links
                WHERE link_collection_id = $1
            """
            collection_links_result = await execute_query_one(collection_links_query, (collection_id,))
            current_collection_links = collection_links_result['count'] if collection_links_result else 0
            
            if current_collection_links + links_to_add > limits['linksPerCollection']:
                return False, f"Links per collection limit reached ({limits['linksPerCollection']}). Upgrade your plan to add more links.", subscription['plan_slug']
            
            # Check total links limit
            if usage['totalLinks'] + links_to_add > limits['totalLinks']:
                return False, f"Total links limit reached ({limits['totalLinks']}). Upgrade your plan to add more links.", subscription['plan_slug']
            
            return True, "", subscription['plan_slug']
            
        except Exception as e:
            logger.error(f"Error checking links limit for user {user_id}: {str(e)}")
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
