import { ArticleResponseDoc } from './article.response.doc';

export class ArticleImageResponseDoc {
  id?: number;
  src?: string;
  article?: ArticleResponseDoc;
  articleId?: number;
}
