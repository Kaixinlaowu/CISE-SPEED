// types/api.ts

// 文章相关类型
export interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
  url?: string;
  citations?: number;
}

export interface ArticleSearchParams {
  query: string;
  filters?: {
    yearRange?: [number, number];
    journals?: string[];
    minCitations?: number;
  };
  limit?: number;
  offset?: number;
}

export interface ArticleSearchResponse {
  articles: Article[];
  totalCount: number;
  page: number;
  totalPages: number;
}

// 提取信息相关类型
export interface ExtractionResult {
  id: string;
  articleId: string;
  extractedData: {
    keyFigures?: KeyFigure[];
    methodologies?: Methodology[];
    results?: Result[];
    conclusions?: Conclusion[];
  };
  confidence: number;
  extractedAt: string;
}

export interface KeyFigure {
  type: 'number' | 'percentage' | 'ratio';
  value: number;
  label: string;
  context: string;
}

export interface Methodology {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: Record<string, any>;
}

export interface Result {
  description: string;
  significance: 'high' | 'medium' | 'low';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supportingData?: any[];
}

export interface Conclusion {
  mainFinding: string;
  implications: string[];
  limitations: string[];
}

// 分析相关类型
export interface AnalysisData {
  id: string;
  metric: string;
  value: number | string;
  unit?: string;
  category: string;
  timestamp: string;
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  title: string;
  xAxis?: string;
  yAxis?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>;
}

// 管理员相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface SystemConfig {
  extraction: {
    enabled: boolean;
    maxContentLength: number;
    timeout: number;
  };
  database: {
    backupInterval: number;
    retentionPeriod: number;
  };
  security: {
    requireAuth: boolean;
    sessionTimeout: number;
  };
}