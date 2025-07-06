/**
 * API service for interacting with Cur8t Agents API
 */

const AGENTS_API_BASE_URL =
  process.env.NEXT_PUBLIC_AGENTS_API_URL || "http://localhost:8000";

export interface ExtractedLink {
  url: string;
  title?: string;
  description?: string;
  domain?: string;
}

export interface ArticleExtractionRequest {
  article_url: string;
  collection_name?: string;
}

export interface ArticleExtractionResponse {
  success: boolean;
  message: string;
  article_title?: string;
  article_url: string;
  total_links_found: number;
  extracted_links: ExtractedLink[];
  collection_name: string;
  created_at: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  error_code?: string;
}

// Bookmark Importer Types
export interface BookmarkUploadResponse {
  success: boolean;
  message: string;
  session_id: string;
  total_bookmarks: number;
  browser_detected: string;
  folder_structure: Record<string, number>;
  processing_status: string;
}

export interface BookmarkCategory {
  name: string;
  description: string;
  keywords: string[];
  bookmarks: Array<{
    url: string;
    title: string;
    description?: string;
    favicon?: string;
    added_date?: string;
    folder_path?: string[];
  }>;
  confidence_score: number;
  suggested_collection_name: string;
}

export interface BookmarkAnalysisRequest {
  session_id: string;
  max_categories?: number;
  min_bookmarks_per_category?: number;
  preferred_categories?: string[];
  merge_similar_categories?: boolean;
}

export interface BookmarkAnalysisResponse {
  success: boolean;
  message: string;
  session_id: string;
  categories: BookmarkCategory[];
  total_bookmarks_processed: number;
  uncategorized_bookmarks: Array<{
    url: string;
    title: string;
    description?: string;
    favicon?: string;
    added_date?: string;
    folder_path?: string[];
  }>;
  processing_time_seconds: number;
  ai_confidence_score: number;
}

export interface CollectionCreationRequest {
  session_id: string;
  selected_categories: string[];
  custom_category_names?: Record<string, string>;
}

export interface CollectionCreationResponse {
  success: boolean;
  message: string;
  session_id: string;
  created_collections: Array<{
    collection_id: string;
    collection_name: string;
    category_name: string;
    links_count: number;
    collection_url?: string;
  }>;
  total_collections_created: number;
  total_links_imported: number;
}

export class AgentsApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public details?: string,
    public errorCode?: string
  ) {
    super(message);
    this.name = "AgentsApiError";
  }
}

class AgentsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AGENTS_API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          throw new AgentsApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        throw new AgentsApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData.details,
          errorData.error_code
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof AgentsApiError) {
        throw error;
      }

      // Network or other errors
      throw new AgentsApiError(
        "Failed to connect to agents API. Please check if the service is running.",
        0,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  /**
   * Extract links from an article
   */
  async extractArticleLinks(
    request: ArticleExtractionRequest
  ): Promise<ArticleExtractionResponse> {
    return this.makeRequest<ArticleExtractionResponse>(
      "/agents/article-extractor/",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Check health of article extractor agent
   */
  async checkArticleExtractorHealth(): Promise<{
    agent: string;
    status: string;
    description: string;
    version: string;
  }> {
    return this.makeRequest("/agents/article-extractor/health");
  }

  /**
   * Get API information
   */
  async getApiInfo(): Promise<{
    message: string;
    version: string;
    description: string;
    agents: Array<{
      name: string;
      description: string;
      status: string;
    }>;
  }> {
    return this.makeRequest("/");
  }

  /**
   * Check overall API health
   */
  async checkHealth(): Promise<{
    status: string;
    service: string;
    version: string;
  }> {
    return this.makeRequest("/health");
  }

  // Bookmark Importer Methods

  /**
   * Upload bookmark file for processing
   */
  async uploadBookmarks(
    file: File,
    browserType?: string,
    userPreferences?: Record<string, unknown>
  ): Promise<BookmarkUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (browserType) {
      formData.append("browser_type", browserType);
    }

    if (userPreferences) {
      formData.append("user_preferences", JSON.stringify(userPreferences));
    }

    const response = await fetch(
      `${this.baseUrl}/agents/bookmark-importer/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        throw new AgentsApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      throw new AgentsApiError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData.details,
        errorData.error_code
      );
    }

    return response.json();
  }

  /**
   * Analyze bookmarks using AI categorization
   */
  async analyzeBookmarks(
    request: BookmarkAnalysisRequest
  ): Promise<BookmarkAnalysisResponse> {
    return this.makeRequest<BookmarkAnalysisResponse>(
      "/agents/bookmark-importer/analyze",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Create collections from analyzed categories
   */
  async createBookmarkCollections(
    request: CollectionCreationRequest
  ): Promise<CollectionCreationResponse> {
    return this.makeRequest<CollectionCreationResponse>(
      "/agents/bookmark-importer/create-collections",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Get session status for bookmark import
   */
  async getBookmarkSessionStatus(sessionId: string): Promise<{
    success: boolean;
    session_id: string;
    status: string;
    progress_percentage: number;
    current_step: string;
    estimated_time_remaining?: number;
    error_message?: string;
  }> {
    return this.makeRequest(`/agents/bookmark-importer/status/${sessionId}`);
  }

  /**
   * Delete bookmark import session
   */
  async deleteBookmarkSession(sessionId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.makeRequest(`/agents/bookmark-importer/session/${sessionId}`, {
      method: "DELETE",
    });
  }

  /**
   * Check health of bookmark importer agent
   */
  async checkBookmarkImporterHealth(): Promise<{
    agent: string;
    status: string;
    description: string;
    version: string;
  }> {
    return this.makeRequest("/agents/bookmark-importer/health");
  }
}

// Export singleton instance
export const agentsApi = new AgentsApiService();

// Export class
export { AgentsApiService };
