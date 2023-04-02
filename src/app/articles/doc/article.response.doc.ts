import { Exclude } from 'class-transformer';
import { ArticleImageResponseDoc } from './article-image.response.doc';
import { CategoryResponseDoc } from './category.response.doc';
import { UserArticleLikeResponseDoc } from './user-article-like.response.doc';

export class ArticleResponseDoc {
  uuid?: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  category?: CategoryResponseDoc;
  categoryId?: number;
  images?: ArticleImageResponseDoc[];
  likes?: UserArticleLikeResponseDoc[];
  totalLike?: number;

  @Exclude()
  id?: number;
  @Exclude()
  deleted?: boolean;
}
