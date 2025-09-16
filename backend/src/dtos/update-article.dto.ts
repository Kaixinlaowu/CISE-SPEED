// update-article.dto.ts
export class UpdateArticleDto {
  title?: string;
  authors?: string[];
  journal?: string;
  year?: number;
  doi?: string;
  abstract?: string;
  url?: string;
  citations?: number;
}
