import { ArticleResponseDoc } from '@articles/doc/article.response.doc';
import { OrderResponseDoc } from './order.response.doc';

export class OrderDetailResponseDoc {
  id?: number;
  articleName?: string;
  description?: string;
  price?: number;
  quantity?: number;
  total?: number;
  article?: ArticleResponseDoc;
  articleId?: number;
  order?: OrderResponseDoc;
  orderId?: number;
  createdAt?: Date;
}
