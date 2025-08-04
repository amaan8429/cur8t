import asyncpg
from contextlib import asynccontextmanager
from .config import settings
import logging
from typing import Optional, Dict, List, Any, Union
import asyncio
from functools import lru_cache
import time

logger = logging.getLogger(__name__)

# Global connection pool
_pool = None

async def get_pool():
    """Get or create the database connection pool"""
    global _pool
    if _pool is None:
        try:
            logger.info(f"🔗 Creating database pool with URL: {settings.database_url[:20]}...")
            _pool = await asyncpg.create_pool(
                settings.database_url,
                min_size=5,
                max_size=20,
                command_timeout=60,
                ssl='require' if 'neon.tech' in settings.database_url else False,
                server_settings={
                    'jit': 'off',  # Disable JIT for better performance
                    'work_mem': '64MB',  # Increase work memory
                    'maintenance_work_mem': '256MB',  # Increase maintenance memory
                }
            )
            
            # Test the connection
            async with _pool.acquire() as conn:
                await conn.execute("SELECT 1")
                logger.info("✅ Database pool created successfully")
                
        except Exception as e:
            logger.error(f"❌ Failed to create database pool: {str(e)}")
            raise
            
    return _pool

@asynccontextmanager
async def get_db_connection():
    """Async context manager for database connections"""
    pool = await get_pool()
    async with pool.acquire() as connection:
        yield connection

# Query result cache for frequently accessed data
_query_cache = {}
_cache_ttl = 300  # 5 minutes

async def execute_query(query: str, params: Optional[tuple] = None, fetch_one: bool = False, fetch_all: bool = True, cache_key: Optional[str] = None) -> Union[Dict[str, Any], List[Dict[str, Any]], int, None]:
    """Execute a database query and return results with optional caching"""
    start_time = time.time()
    
    # Check cache for read operations
    if cache_key and fetch_all and not fetch_one:
        cached_result = _query_cache.get(cache_key)
        if cached_result:
            logger.info(f"📦 Cache hit for key: {cache_key}")
            return cached_result
    
    pool = await get_pool()
    async with pool.acquire() as conn:
        if fetch_one:
            result = await conn.fetchrow(query, *(params or ()))
            query_time = time.time() - start_time
            logger.info(f"⚡ Query executed in {query_time:.3f}s")
            return dict(result) if result else None
        elif fetch_all:
            results = await conn.fetch(query, *(params or ()))
            result_list = [dict(row) for row in results] if results else []
            
            # Cache the result if cache_key is provided
            if cache_key:
                _query_cache[cache_key] = result_list
                # Schedule cache cleanup
                asyncio.create_task(_cleanup_cache(cache_key))
            
            query_time = time.time() - start_time
            logger.info(f"⚡ Query executed in {query_time:.3f}s | Rows: {len(result_list)}")
            return result_list
        else:
            result = await conn.execute(query, *(params or ()))
            query_time = time.time() - start_time
            logger.info(f"⚡ Query executed in {query_time:.3f}s")
            return result

async def execute_query_one(query: str, params: Optional[tuple] = None, cache_key: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Execute a query and return one result as a dictionary"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.fetchrow(query, *(params or ()))
        return dict(result) if result else None

async def execute_query_all(query: str, params: Optional[tuple] = None, cache_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """Execute a query and return all results as a list of dictionaries"""
    return await execute_query(query, params, fetch_all=True, cache_key=cache_key)

async def execute_insert(query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
    """Execute an insert query and return the inserted record"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.fetchrow(query, *(params or ()))
        return dict(result) if result else None

async def _cleanup_cache(cache_key: str):
    """Clean up cache entry after TTL"""
    await asyncio.sleep(_cache_ttl)
    _query_cache.pop(cache_key, None)

def clear_cache():
    """Clear the query cache"""
    global _query_cache
    _query_cache.clear()
    logger.info("🗑️ Query cache cleared")

async def health_check():
    """Check database connection health and performance"""
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            # Test basic connectivity
            result = await conn.fetchval("SELECT 1")
            
            # Get connection pool stats
            pool_stats = {
                "min_size": pool.get_min_size(),
                "max_size": pool.get_max_size(),
                "size": pool.get_size(),
                "free_size": "N/A"  # asyncpg doesn't expose free size
            }
            
            # Get cache stats
            cache_stats = {
                "cache_size": len(_query_cache),
                "cache_keys": list(_query_cache.keys())
            }
            
            logger.info(f"🏥 Health check - Pool: {pool_stats} | Cache: {cache_stats}")
            return {"status": "healthy", "pool": pool_stats, "cache": cache_stats}
            
    except Exception as e:
        logger.error(f"❌ Health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)} 