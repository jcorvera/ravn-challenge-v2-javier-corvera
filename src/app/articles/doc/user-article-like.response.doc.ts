import { UserResponseDoc } from '@app/users/doc/user.response.doc';
import { ArticleResponseDoc } from './article.response.doc';

export class UserArticleLikeResponseDoc {
  user?: UserResponseDoc;
  userId?: number;
  article?: ArticleResponseDoc;
  articleId?: number;
  createdAt?: Date;
}
