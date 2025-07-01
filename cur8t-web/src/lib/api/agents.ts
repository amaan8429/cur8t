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
}

// Export singleton instance
export const agentsApi = new AgentsApiService();

// Export class
export { AgentsApiService };
