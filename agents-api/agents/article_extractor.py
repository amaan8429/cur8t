import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Optional, Tuple, Union
import re
from datetime import datetime
import time

from .models import ExtractedLink, ArticleLinkResponse, ErrorResponse

class ArticleLinkExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def _is_valid_url(self, url: str) -> bool:
        """Simple URL validation"""
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return url_pattern.match(url) is not None
    
    def extract_links_from_article(self, article_url: str, collection_name: Optional[str] = None) -> Tuple[Optional[ArticleLinkResponse], Optional[ErrorResponse]]:
        """
        Extract all links from an article and prepare them for collection creation
        """
        try:
            # Validate URL
            if not self._is_valid_url(article_url):
                return None, ErrorResponse(
                    error="Invalid URL",
                    details="The provided URL is not valid"
                )
            
            # Fetch the article
            response = self.session.get(article_url, timeout=10)
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
                collection_name = f"Links from {article_title or urlparse(article_url).netloc}"
            
            # Create response
            result = ArticleLinkResponse(
                success=True,
                message=f"Successfully extracted {len(filtered_links)} links from the article",
                article_title=article_title,
                article_url=article_url,
                total_links_found=len(filtered_links),
                extracted_links=filtered_links,
                collection_name=collection_name,
                created_at=datetime.now()
            )
            
            return result, None
            
        except requests.exceptions.RequestException as e:
            return None, ErrorResponse(
                error="Failed to fetch article",
                details=str(e)
            )
        except Exception as e:
            return None, ErrorResponse(
                error="Processing error",
                details=str(e)
            )
    
    def _extract_title(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract article title from HTML"""
        # Try multiple selectors for title
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
                if title and len(str(title).strip()) > 0:
                    return str(title).strip()
        
        return None
    
    def _extract_all_links(self, soup: BeautifulSoup, base_url: str) -> List[dict]:
        """Extract all links from the HTML"""
        links = []
        
        # Find all anchor tags with href
        for link in soup.find_all('a', href=True):
            href = link['href'].strip()
            
            # Skip empty hrefs, anchors, and javascript
            if not href or href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
                continue
            
            # Convert relative URLs to absolute
            absolute_url = urljoin(base_url, href)
            
            # Extract link text and title
            link_text = link.get_text(strip=True)
            link_title = link.get('title', '') or link_text
            
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
            if not self._is_valid_url(url):
                continue
            
            # Skip common non-content URLs
            skip_patterns = [
                'facebook.com/sharer',
                'twitter.com/intent',
                'linkedin.com/sharing',
                'pinterest.com/pin',
                'reddit.com/submit',
                '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip'
            ]
            
            if any(pattern in url.lower() for pattern in skip_patterns):
                continue
            
            # Extract domain
            domain = urlparse(url).netloc
            
            # Create ExtractedLink object
            extracted_link = ExtractedLink(
                url=url,
                title=link['title'][:200] if link['title'] else None,  # Limit title length
                description=link['text'][:300] if link['text'] else None,  # Limit description length
                domain=domain
            )
            
            filtered.append(extracted_link)
            seen_urls.add(url)
        
        return filtered[:50]  # Limit to 50 links to avoid overwhelming responses

# Create global instance
article_extractor = ArticleLinkExtractor() 