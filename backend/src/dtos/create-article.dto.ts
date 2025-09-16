// create-article.dto.ts
export class CreateArticleDto {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract?: string;
  url?: string;
  citations?: number;
}
