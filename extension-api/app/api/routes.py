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
    Link,
    Favorite,
    FavoritesResponse,
    CreateFavoriteRequest,
    CreateFavoriteResponse,
    UpdateFavoriteRequest,
    UpdateFavoriteResponse,
    DeleteFavoriteResponse,
    BulkLinkRequest,
    BulkCreateLinkResponse,
    CreateCollectionRequest,
    CreateCollectionResponse,
    CreateCollectionWithLinksRequest,
    CreateCollectionWithLinksResponse
)
from ..core.database import execute_query_one, execute_query_all, execute_insert, execute_query
from ..core.utils import extract_title_from_url, generate_fallback_title

router = APIRouter()

def get_user_id_from_api_key(authorization: Optional[str] = Header(None)) -> str:
    """Extract and validate API key, then return the associated user ID"""
    logger.info(f"🔑 Authorization header received: {authorization}")
    logger.info(f"🔑 Authorization type: {type(authorization)}")
    logger.info(f"🔑 Authorization is None: {authorization is None}")
    
    if not authorization:
        logger.error("❌ No authorization header provided")
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    logger.info(f"🔑 Authorization starts with 'Bearer ': {authorization.startswith('Bearer ')}")
    
    if not authorization.startswith("Bearer "):
        logger.error(f"❌ Invalid authorization format. Expected 'Bearer <api_key>', got: {authorization}")
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    api_key = authorization[7:]  # Remove "Bearer " prefix
    logger.info(f"🔑 Extracted API key: {api_key[:8]}...{api_key[-4:] if len(api_key) > 12 else api_key}")
    
    # Validate API key against database
    try:
        api_key_query = """
            SELECT ak.user_id, ak.name, ak.created_at, u.name as user_name
            FROM api_keys ak
            JOIN users u ON ak.user_id = u.id
            WHERE ak.key = %s
        """
        
        logger.info(f"🔍 Validating API key in database...")
        api_key_result = execute_query_one(api_key_query, (api_key,))
        
        if not api_key_result:
            logger.error(f"❌ Invalid API key: {api_key[:8]}...")
            raise HTTPException(status_code=401, detail="Invalid API key")
        
        user_id = api_key_result['user_id']
        api_key_name = api_key_result['name']
        user_name = api_key_result['user_name']
        
        logger.info(f"✅ Valid API key '{api_key_name}' for user: {user_name} (ID: {user_id})")
        return user_id
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Database error during API key validation: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication service unavailable")

@router.get("/")
def root():
    return {"message": "Extension API v1.0"}

@router.get("/test-auth")
async def test_auth(authorization: Optional[str] = Header(None)):
    """Test endpoint to debug API key authentication"""
    logger.info(f"🧪 TEST AUTH - Received header: {authorization}")
    logger.info(f"🧪 TEST AUTH - Header type: {type(authorization)}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        response = {
            "success": True,
            "message": "API key authentication successful",
            "user_id": user_id,
            "received_header": authorization[:20] + "..." if authorization and len(authorization) > 20 else authorization,
            "header_present": authorization is not None,
            "starts_with_bearer": authorization.startswith("Bearer ") if authorization else False
        }
        
    except HTTPException as e:
        response = {
            "success": False,
            "error": e.detail,
            "received_header": authorization[:20] + "..." if authorization and len(authorization) > 20 else authorization,
            "header_present": authorization is not None,
            "starts_with_bearer": authorization.startswith("Bearer ") if authorization else False
        }
    except Exception as e:
        response = {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "received_header": authorization[:20] + "..." if authorization and len(authorization) > 20 else authorization,
            "header_present": authorization is not None,
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
        user_id = get_user_id_from_api_key(authorization)
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

@router.post("/collections", response_model=Union[CreateCollectionResponse, ErrorResponse])
async def create_collection(
    collection_data: CreateCollectionRequest,
    authorization: Optional[str] = Header(None)
):
    """Create a new collection"""
    logger.info("📁 CREATE COLLECTION - Endpoint called")
    logger.info(f"📁 CREATE COLLECTION - Title: {collection_data.title}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        # Validate visibility
        if collection_data.visibility not in ["private", "public"]:
            raise HTTPException(status_code=422, detail="Visibility must be 'private' or 'public'")
        
        # Create new collection
        collection_id = str(uuid.uuid4())
        insert_collection_query = """
            INSERT INTO collections (id, title, description, visibility, user_id, total_links, created_at, updated_at)
            VALUES (%s::uuid, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, visibility, total_links, created_at
        """
        
        now = datetime.utcnow()
        created_collection = execute_insert(
            insert_collection_query,
            (collection_id, collection_data.title, collection_data.description, collection_data.visibility, user_id, 0, now, now)
        )
        
        if not created_collection:
            raise HTTPException(status_code=500, detail="Failed to create collection")
        
        response_collection = Collection(
            id=str(created_collection['id']),
            title=created_collection['title'],
            description=created_collection['description'],
            visibility=created_collection['visibility'],
            totalLinks=created_collection['total_links'],
            createdAt=created_collection['created_at']
        )
        
        logger.info(f"📁 CREATE COLLECTION - Successfully created collection: {collection_id}")
        
        return CreateCollectionResponse(success=True, data=response_collection)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create collection: {str(e)}")

@router.post("/collections/{collection_id}/links", response_model=Union[CreateLinkResponse, ErrorResponse])
async def create_link(
    collection_id: str,
    link_data: CreateLinkRequest,
    authorization: Optional[str] = Header(None)
):
    """Add a link to a collection"""
    try:
        user_id = get_user_id_from_api_key(authorization)
        
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

@router.post("/collections/{collection_id}/links/bulk", response_model=Union[BulkCreateLinkResponse, ErrorResponse])
async def create_bulk_links(
    collection_id: str,
    bulk_data: BulkLinkRequest,
    authorization: Optional[str] = Header(None)
):
    """Add multiple links to a collection at once"""
    logger.info(f"📦 BULK LINKS - Endpoint called for collection: {collection_id}")
    logger.info(f"📦 BULK LINKS - Number of links to add: {len(bulk_data.links)}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
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
        
        current_total = collection_result['total_links']
        created_links = []
        now = datetime.utcnow()
        
        # Process each link
        for link_data in bulk_data.links:
            try:
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
                
                created_link = execute_insert(
                    insert_link_query,
                    (link_id, final_title, str(link_data.url), collection_id, user_id, now, now)
                )
                
                if created_link:
                    response_link = Link(
                        id=str(created_link['id']),
                        title=created_link['title'],
                        url=created_link['url'],
                        linkCollectionId=str(created_link['link_collection_id']),
                        userId=created_link['user_id'],
                        createdAt=created_link['created_at'],
                        updatedAt=created_link['updated_at']
                    )
                    created_links.append(response_link)
                    current_total += 1
                    
            except Exception as e:
                logger.error(f"❌ Failed to create link {link_data.url}: {str(e)}")
                # Continue with other links even if one fails
                continue
        
        # Update collection's total links count
        update_collection_query = """
            UPDATE collections 
            SET total_links = %s 
            WHERE id = %s::uuid AND user_id = %s
        """
        execute_query(
            update_collection_query, 
            (current_total, collection_id, user_id), 
            fetch_all=False
        )
        
        logger.info(f"📦 BULK LINKS - Successfully added {len(created_links)} out of {len(bulk_data.links)} links")
        
        return BulkCreateLinkResponse(
            success=True,
            data=created_links,
            total_added=len(created_links),
            total_requested=len(bulk_data.links)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create bulk links: {str(e)}")

@router.post("/collections/with-links", response_model=Union[CreateCollectionWithLinksResponse, ErrorResponse])
async def create_collection_with_links(
    request_data: CreateCollectionWithLinksRequest,
    authorization: Optional[str] = Header(None)
):
    """Create a new collection and add multiple links to it in one call"""
    logger.info("🚀 CREATE COLLECTION WITH LINKS - Endpoint called")
    logger.info(f"🚀 CREATE COLLECTION WITH LINKS - Title: {request_data.title}")
    logger.info(f"🚀 CREATE COLLECTION WITH LINKS - Number of links: {len(request_data.links)}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        # Validate visibility
        if request_data.visibility not in ["private", "public"]:
            raise HTTPException(status_code=422, detail="Visibility must be 'private' or 'public'")
        
        # Create new collection
        collection_id = str(uuid.uuid4())
        insert_collection_query = """
            INSERT INTO collections (id, title, description, visibility, user_id, total_links, created_at, updated_at)
            VALUES (%s::uuid, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, visibility, total_links, created_at
        """
        
        now = datetime.utcnow()
        created_collection = execute_insert(
            insert_collection_query,
            (collection_id, request_data.title, request_data.description, request_data.visibility, user_id, 0, now, now)
        )
        
        if not created_collection:
            raise HTTPException(status_code=500, detail="Failed to create collection")
        
        # Process each link
        created_links = []
        current_total = 0
        
        for link_data in request_data.links:
            try:
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
                
                created_link = execute_insert(
                    insert_link_query,
                    (link_id, final_title, str(link_data.url), collection_id, user_id, now, now)
                )
                
                if created_link:
                    response_link = Link(
                        id=str(created_link['id']),
                        title=created_link['title'],
                        url=created_link['url'],
                        linkCollectionId=str(created_link['link_collection_id']),
                        userId=created_link['user_id'],
                        createdAt=created_link['created_at'],
                        updatedAt=created_link['updated_at']
                    )
                    created_links.append(response_link)
                    current_total += 1
                    
            except Exception as e:
                logger.error(f"❌ Failed to create link {link_data.url}: {str(e)}")
                # Continue with other links even if one fails
                continue
        
        # Update collection's total links count
        update_collection_query = """
            UPDATE collections 
            SET total_links = %s 
            WHERE id = %s::uuid AND user_id = %s
        """
        execute_query(
            update_collection_query, 
            (current_total, collection_id, user_id), 
            fetch_all=False
        )
        
        # Create response collection object
        response_collection = Collection(
            id=str(created_collection['id']),
            title=created_collection['title'],
            description=created_collection['description'],
            visibility=created_collection['visibility'],
            totalLinks=current_total,
            createdAt=created_collection['created_at']
        )
        
        logger.info(f"🚀 CREATE COLLECTION WITH LINKS - Successfully created collection with {len(created_links)} links")
        
        return CreateCollectionWithLinksResponse(
            success=True,
            collection=response_collection,
            links=created_links,
            total_added=len(created_links),
            total_requested=len(request_data.links)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create collection with links: {str(e)}")

# Favorites endpoints
@router.get("/favorites", response_model=Union[FavoritesResponse, ErrorResponse])
async def get_favorites(authorization: Optional[str] = Header(None)):
    """Get user's favorite links"""
    logger.info("⭐ FAVORITES - Endpoint called")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        logger.info(f"⭐ FAVORITES - User ID extracted: {user_id}")
        
        # Get user's favorites
        favorites_query = """
            SELECT id, title, url, user_id as "userId", created_at as "createdAt", updated_at as "updatedAt"
            FROM favorites 
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        
        favorites_result = execute_query_all(favorites_query, (user_id,))
        
        favorites = []
        for fav_data in favorites_result:
            favorite = Favorite(
                id=str(fav_data['id']),
                title=fav_data['title'],
                url=fav_data['url'],
                userId=fav_data['userId'],
                createdAt=fav_data['createdAt'],
                updatedAt=fav_data['updatedAt']
            )
            favorites.append(favorite)
        
        return FavoritesResponse(data=favorites)
        
    except HTTPException as e:
        logger.error(f"❌ HTTP Exception in favorites: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in favorites: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch favorites: {str(e)}")

@router.post("/favorites", response_model=Union[CreateFavoriteResponse, ErrorResponse])
async def create_favorite(
    favorite_data: CreateFavoriteRequest,
    authorization: Optional[str] = Header(None)
):
    """Add a new favorite link"""
    logger.info("⭐ CREATE FAVORITE - Endpoint called")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        # Check if favorite already exists
        existing_query = """
            SELECT id FROM favorites 
            WHERE user_id = %s AND url = %s
        """
        existing_result = execute_query_one(existing_query, (user_id, str(favorite_data.url)))
        
        if existing_result:
            raise HTTPException(status_code=409, detail="This URL is already in your favorites")
        
        # Insert new favorite
        favorite_id = str(uuid.uuid4())
        insert_favorite_query = """
            INSERT INTO favorites (id, title, url, user_id, created_at, updated_at)
            VALUES (%s::uuid, %s, %s, %s, %s, %s)
            RETURNING id, title, url, user_id, created_at, updated_at
        """
        
        now = datetime.utcnow()
        created_favorite = execute_insert(
            insert_favorite_query,
            (favorite_id, favorite_data.title, str(favorite_data.url), user_id, now, now)
        )
        
        if not created_favorite:
            raise HTTPException(status_code=500, detail="Failed to create favorite")
        
        response_favorite = Favorite(
            id=str(created_favorite['id']),
            title=created_favorite['title'],
            url=created_favorite['url'],
            userId=created_favorite['user_id'],
            createdAt=created_favorite['created_at'],
            updatedAt=created_favorite['updated_at']
        )
        
        return CreateFavoriteResponse(success=True, data=response_favorite)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create favorite: {str(e)}")

@router.put("/favorites/{favorite_id}", response_model=Union[UpdateFavoriteResponse, ErrorResponse])
async def update_favorite(
    favorite_id: str,
    favorite_data: UpdateFavoriteRequest,
    authorization: Optional[str] = Header(None)
):
    """Update a favorite link's title"""
    logger.info(f"⭐ UPDATE FAVORITE - Endpoint called for ID: {favorite_id}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        # Update the favorite
        update_query = """
            UPDATE favorites 
            SET title = %s, updated_at = %s
            WHERE id = %s::uuid AND user_id = %s
            RETURNING id, title, url, user_id, created_at, updated_at
        """
        
        now = datetime.utcnow()
        updated_favorite = execute_insert(
            update_query,
            (favorite_data.title, now, favorite_id, user_id)
        )
        
        if not updated_favorite:
            raise HTTPException(status_code=404, detail="Favorite not found or you don't have permission to update it")
        
        response_favorite = Favorite(
            id=str(updated_favorite['id']),
            title=updated_favorite['title'],
            url=updated_favorite['url'],
            userId=updated_favorite['user_id'],
            createdAt=updated_favorite['created_at'],
            updatedAt=updated_favorite['updated_at']
        )
        
        return UpdateFavoriteResponse(success=True, data=response_favorite)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update favorite: {str(e)}")

@router.delete("/favorites/{favorite_id}", response_model=Union[DeleteFavoriteResponse, ErrorResponse])
async def delete_favorite(
    favorite_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a favorite link"""
    logger.info(f"⭐ DELETE FAVORITE - Endpoint called for ID: {favorite_id}")
    
    try:
        user_id = get_user_id_from_api_key(authorization)
        
        # Delete the favorite
        delete_query = """
            DELETE FROM favorites 
            WHERE id = %s::uuid AND user_id = %s
            RETURNING id
        """
        
        deleted_favorite = execute_insert(delete_query, (favorite_id, user_id))
        
        if not deleted_favorite:
            raise HTTPException(status_code=404, detail="Favorite not found or you don't have permission to delete it")
        
        return DeleteFavoriteResponse(success=True, message="Favorite deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete favorite: {str(e)}")
