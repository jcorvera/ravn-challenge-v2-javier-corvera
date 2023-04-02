import { ArticleResponseDoc } from './article.response.doc';

export class CategoryResponseDoc {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  articles?: ArticleResponseDoc[];
}
