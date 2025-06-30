"""
Article Link Extractor service implementation
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Optional, Tuple
from datetime import datetime

from .models import ArticleLinkResponse
from core.models import ErrorResponse, ExtractedLink
from core.utils import is_valid_url, get_domain_from_url, create_http_session, clean_text, should_skip_url
from config.settings import settings

class ArticleLinkExtractorService:
    """Service for extracting links from articles"""
    
    def __init__(self):
        self.session = create_http_session()
    
    def extract_links_from_article(
        self, 
        article_url: str, 
        collection_name: Optional[str] = None
    ) -> Tuple[Optional[ArticleLinkResponse], Optional[ErrorResponse]]:
        """
        Extract all links from an article and prepare them for collection creation
        
        Args:
            article_url: URL of the article to extract links from
            collection_name: Optional custom collection name
            
        Returns:
            Tuple of (response, error) - one will be None
        """
        try:
            # Validate URL
            if not is_valid_url(article_url):
                return None, ErrorResponse(
                    error="Invalid URL",
                    details="The provided URL is not valid"
                )
            
            # Fetch the article
            response = self.session.get(article_url, timeout=settings.request_timeout)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract article title
            article_title = self._extract_title(soup)
            
            # Extract all links
            links = self._extract_all_links(soup, article_url)
            
            # Filter and process links
            filtered_links = self._filter_links(links)
            
            # Generate collection name if not provided
            if not collection_name:
                collection_name = f"Links from {article_title or get_domain_from_url(article_url)}"
            
            # Create response
            result = ArticleLinkResponse(
                success=True,
                message=f"Successfully extracted {len(filtered_links)} links from the article",
                article_title=article_title,
                article_url=article_url,
                total_links_found=len(filtered_links),
                extracted_links=filtered_links,
                collection_name=collection_name
            )
            
            return result, None
            
        except requests.exceptions.RequestException as e:
            return None, ErrorResponse(
                error="Failed to fetch article",
                details=str(e),
                error_code="FETCH_ERROR"
            )
        except Exception as e:
            return None, ErrorResponse(
                error="Processing error",
                details=str(e),
                error_code="PROCESSING_ERROR"
            )
    
    def _extract_title(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract article title from HTML"""
        title_selectors = [
            'h1',
            'title',
            '[property="og:title"]',
            '.entry-title',
            '.post-title',
            '.article-title'
        ]
        
        for selector in title_selectors:
            element = soup.select_one(selector)
            if element:
                if selector == '[property="og:title"]':
                    title = element.get('content')
                else:
                    title = element.get_text(strip=True)
                
                if title:
                    cleaned_title = clean_text(str(title), max_length=200)
                    if cleaned_title:
                        return cleaned_title
        
        return None
    
    def _extract_all_links(self, soup: BeautifulSoup, base_url: str) -> List[dict]:
        """Extract all links from the HTML"""
        links = []
        
        # Find all anchor tags with href
        for link in soup.find_all('a', href=True):
            href = link['href'].strip()
            
            # Skip empty hrefs and basic patterns
            if not href or href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
                continue
            
            # Convert relative URLs to absolute
            absolute_url = urljoin(base_url, href)
            
            # Extract link text and title
            link_text = clean_text(link.get_text(strip=True), max_length=300)
            link_title = link.get('title', '') or link_text
            link_title = clean_text(str(link_title), max_length=200)
            
            links.append({
                'url': absolute_url,
                'text': link_text,
                'title': link_title
            })
        
        return links
    
    def _filter_links(self, links: List[dict]) -> List[ExtractedLink]:
        """Filter and clean extracted links"""
        filtered = []
        seen_urls = set()
        
        for link in links:
            url = link['url']
            
            # Skip duplicates
            if url in seen_urls:
                continue
            
            # Validate URL
            if not is_valid_url(url):
                continue
            
            # Skip common patterns
            if should_skip_url(url):
                continue
            
            # Extract domain
            domain = get_domain_from_url(url)
            
            # Create ExtractedLink object
            extracted_link = ExtractedLink(
                url=url,
                title=link['title'] if link['title'] else None,
                description=link['text'] if link['text'] else None,
                domain=domain
            )
            
            filtered.append(extracted_link)
            seen_urls.add(url)
            
            # Limit results
            if len(filtered) >= settings.max_links_per_extraction:
                break
        
        return filtered

# Global instance
article_extractor_service = ArticleLinkExtractorService() 