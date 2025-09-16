// lib/api-client.ts
import { 
  ApiResponse, 
  Article, 
  ArticleSearchParams, 
  ArticleSearchResponse,
  ExtractionResult,
  AnalysisData,
  User,
  SystemConfig
} from '../types/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  }

  // 文章搜索
  async searchArticles(params: ArticleSearchParams): Promise<ArticleSearchResponse> {
    return this.request<ArticleSearchResponse>('/articles/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // 获取文章详情
  async getArticle(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  // 提取信息
  async extractInformation(content: string, articleId?: string): Promise<ExtractionResult> {
    return this.request<ExtractionResult>('/extract', {
      method: 'POST',
      body: JSON.stringify({ content, articleId }),
    });
  }

  // 保存到数据库
  async saveToDatabase(data: ExtractionResult): Promise<void> {
    return this.request<void>('/data/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 获取分析数据
  async getAnalysisData(filters?: Record<string, never>): Promise<AnalysisData[]> {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<AnalysisData[]>(`/analysis/data${queryString}`);
  }

  // 管理员功能
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  async getConfig(): Promise<SystemConfig> {
    return this.request<SystemConfig>('/admin/config');
  }

  async updateConfig(config: Partial<SystemConfig>): Promise<void> {
    return this.request<void>('/admin/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }
}

export const apiClient = new ApiClient();