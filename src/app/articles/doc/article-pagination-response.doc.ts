import { PaginationResponseDoc } from '@common/doc/pagination-response.doc';
import { ArticleResponseDoc } from './article.response.doc';
import { Type } from 'class-transformer';

export class ArticlePaginationResponseDoc extends PaginationResponseDoc {
  @Type(() => ArticleResponseDoc)
  articles: ArticleResponseDoc[];
}
