import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from .config import settings
import logging
from typing import Optional, Dict, List, Any, Union

logger = logging.getLogger(__name__)

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    connection = None
    try:
        connection = psycopg2.connect(
            settings.database_url,
            cursor_factory=RealDictCursor
        )
        yield connection
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        if connection:
            connection.rollback()
        raise
    finally:
        if connection:
            connection.close()

def execute_query(query: str, params: Optional[tuple] = None, fetch_one: bool = False, fetch_all: bool = True) -> Union[Dict[str, Any], List[Dict[str, Any]], int, None]:
    """Execute a database query and return results"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            
            if fetch_one:
                result = cursor.fetchone()
                return dict(result) if result else None
            elif fetch_all:
                results = cursor.fetchall()
                return [dict(row) for row in results] if results else []
            else:
                conn.commit()
                return cursor.rowcount

def execute_query_one(query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
    """Execute a query and return one result as a dictionary"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            result = cursor.fetchone()
            return dict(result) if result else None

def execute_query_all(query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
    """Execute a query and return all results as a list of dictionaries"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            results = cursor.fetchall()
            return [dict(row) for row in results] if results else []

def execute_insert(query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
    """Execute an insert query and return the inserted record"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            conn.commit()
            result = cursor.fetchone()
            return dict(result) if result else None 