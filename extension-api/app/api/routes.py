from fastapi import APIRouter, HTTPException, Header
from typing import Optional, Union
import uuid
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from ..models.schemas import (
    TopCollectionsResponse, 
    CreateLinkRequest, 
    CreateLinkResponse, 
    ErrorResponse,
    Collection,
    Link
)
from ..core.database import execute_query_one, execute_query_all, execute_insert, execute_query
from ..core.utils import extract_title_from_url, generate_fallback_title

router = APIRouter()

def get_user_id_from_header(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from authorization header"""
    logger.info(f"🔍 Authorization header received: {authorization}")
    logger.info(f"🔍 Authorization type: {type(authorization)}")
    logger.info(f"🔍 Authorization is None: {authorization is None}")
    
    if not authorization:
        logger.error("❌ No authorization header provided")
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    logger.info(f"🔍 Authorization starts with 'Bearer ': {authorization.startswith('Bearer ')}")
    
    # For now, we'll extract user ID from the header
    # In production, you'd want to validate the JWT token from Clerk
    if authorization.startswith("Bearer "):
        user_id = authorization[7:]  # Remove "Bearer " prefix
        logger.info(f"✅ Extracted user ID: {user_id}")
        return user_id
    
    logger.error(f"❌ Invalid authorization format. Expected 'Bearer <token>', got: {authorization}")
    raise HTTPException(status_code=401, detail="Invalid authorization format")

@router.get("/")
def root():
    return {"message": "Extension API v1.0"}

@router.get("/test-auth")
async def test_auth(authorization: Optional[str] = Header(None)):
    """Test endpoint to debug authorization header"""
    logger.info(f"🧪 TEST AUTH - Received header: {authorization}")
    logger.info(f"🧪 TEST AUTH - Header type: {type(authorization)}")
    
    response = {
        "received_header": authorization,
        "extracted_user_id": authorization[7:] if authorization and authorization.startswith("Bearer ") else None,
        "header_present": authorization is not None,
        "header_length": len(authorization) if authorization else 0,
        "starts_with_bearer": authorization.startswith("Bearer ") if authorization else False
    }
    
    logger.info(f"🧪 TEST AUTH - Response: {response}")
    return response

@router.get("/top-collections", response_model=Union[TopCollectionsResponse, ErrorResponse])
async def get_top_collections(authorization: Optional[str] = Header(None)):
    """Get user's top 5 collections"""
    logger.info("🚀 TOP COLLECTIONS - Endpoint called")
    logger.info(f"🚀 TOP COLLECTIONS - Authorization header: {authorization}")
    
    try:
        user_id = get_user_id_from_header(authorization)
        logger.info(f"🚀 TOP COLLECTIONS - User ID extracted: {user_id}")
        
        # Get user's top collections array
        user_query = """
            SELECT top_collections 
            FROM users 
            WHERE id = %s 
            LIMIT 1
        """
        logger.info(f"🔍 Executing user query for user_id: {user_id}")
        user_result = execute_query_one(user_query, (user_id,))
        logger.info(f"🔍 User query result: {user_result}")
        
        if not user_result:
            logger.error(f"❌ User not found in database: {user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        top_collection_ids = user_result['top_collections'] if user_result['top_collections'] else []
        
        if not top_collection_ids:
            return TopCollectionsResponse(data=[])
        
        # Convert list to format for SQL IN clause
        placeholders = ','.join(['%s'] * len(top_collection_ids))
        
        # Get the actual collection details
        # Cast the text array to UUID array for proper comparison
        collections_query = """
            SELECT id, title, description, visibility, total_links as "totalLinks", created_at as "createdAt"
            FROM collections 
            WHERE user_id = %s AND id = ANY(%s::uuid[])
        """
        
        collections_result = execute_query_all(
            collections_query, 
            (user_id, top_collection_ids)
        )
        
        # Maintain the order from top_collection_ids
        collections_dict = {str(col['id']): col for col in collections_result}
        ordered_collections = []
        
        for collection_id in top_collection_ids:
            if collection_id in collections_dict:
                col_data = collections_dict[collection_id]
                collection = Collection(
                    id=str(col_data['id']),
                    title=col_data['title'],
                    description=col_data['description'],
                    visibility=col_data['visibility'],
                    totalLinks=col_data['totalLinks'],
                    createdAt=col_data['createdAt']
                )
                ordered_collections.append(collection)
        
        return TopCollectionsResponse(data=ordered_collections)
        
    except HTTPException as e:
        logger.error(f"❌ HTTP Exception in top collections: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in top collections: {str(e)}")
        logger.error(f"❌ Exception type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch top collections: {str(e)}")

@router.post("/collections/{collection_id}/links", response_model=Union[CreateLinkResponse, ErrorResponse])
async def create_link(
    collection_id: str,
    link_data: CreateLinkRequest,
    authorization: Optional[str] = Header(None)
):
    """Add a link to a collection"""
    try:
        user_id = get_user_id_from_header(authorization)
        
        # Validate collection exists and belongs to user
        collection_query = """
            SELECT id, total_links 
            FROM collections 
            WHERE id = %s::uuid AND user_id = %s
        """
        collection_result = execute_query_one(
            collection_query, 
            (collection_id, user_id)
        )
        
        if not collection_result:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Extract title if not provided
        final_title = link_data.title or ""
        if not final_title.strip():
            try:
                final_title = await extract_title_from_url(str(link_data.url))
            except Exception:
                final_title = generate_fallback_title(str(link_data.url))
        
        # Insert the new link
        link_id = str(uuid.uuid4())
        insert_link_query = """
            INSERT INTO links (id, title, url, link_collection_id, user_id, created_at, updated_at)
            VALUES (%s::uuid, %s, %s, %s::uuid, %s, %s, %s)
            RETURNING id, title, url, link_collection_id, user_id, created_at, updated_at
        """
        
        now = datetime.utcnow()
        created_link = execute_insert(
            insert_link_query,
            (link_id, final_title, str(link_data.url), collection_id, user_id, now, now)
        )
        
        if not created_link:
            raise HTTPException(status_code=500, detail="Failed to create link")
        
        # Update collection's total links count
        current_total = collection_result['total_links']
        update_collection_query = """
            UPDATE collections 
            SET total_links = %s 
            WHERE id = %s::uuid AND user_id = %s
        """
        # Update collection's total links count
        execute_query(
            update_collection_query, 
            (current_total + 1, collection_id, user_id), 
            fetch_all=False
        )
        
        # Create response link object
        response_link = Link(
            id=str(created_link['id']),
            title=created_link['title'],
            url=created_link['url'],
            linkCollectionId=str(created_link['link_collection_id']),
            userId=created_link['user_id'],
            createdAt=created_link['created_at'],
            updatedAt=created_link['updated_at']
        )
        
        return CreateLinkResponse(success=True, data=response_link)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create link: {str(e)}")
