/**
 * Extract the title from a URL by fetching the page and parsing the <title> tag
 */
export async function extractTitleFromUrl(url: string): Promise<string> {
  try {
    // Ensure the URL has a protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkTitleExtractor/1.0)',
      },
      // Set a timeout
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }

    // Fallback: try to extract from Open Graph title
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["|']og:title["|'][^>]*content=["|']([^"|']+)["|']/i
    );
    if (ogTitleMatch && ogTitleMatch[1]) {
      return ogTitleMatch[1].trim();
    }

    // Last fallback: use domain name
    const urlObj = new URL(fullUrl);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    console.warn('Failed to extract title from URL:', error);

    // Fallback: extract domain name from URL
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      // Final fallback: use the URL itself
      return url;
    }
  }
}

/**
 * Generate a fallback title from URL
 */
export function generateFallbackTitle(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace('www.', '');
    const pathname = urlObj.pathname;

    // If there's a meaningful path, use it
    if (pathname && pathname !== '/' && pathname.length > 1) {
      const pathParts = pathname.split('/').filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];

      // Clean up the path part
      const cleanPart = lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.(html?|php|aspx?)$/i, '')
        .trim();

      if (cleanPart.length > 0) {
        return `${cleanPart} - ${hostname}`;
      }
    }

    return hostname;
  } catch {
    return url;
  }
}
