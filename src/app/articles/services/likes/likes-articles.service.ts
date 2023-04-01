import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class LikesArticlesService {
  constructor(private prisma: PrismaService, private articlesService: ArticlesService) {}

  async likeArticle(uuid: string, userId: number) {
    let count = 0;
    const article = await this.articlesService.findByUuid(uuid);

    if (!article || article.deleted) {
      throw new NotFoundException();
    }

    // Dislike if alredy liked
    const AlreadyLike = await this.prisma.userArticleLike.deleteMany({
      where: { articleId: article.uuid, userId: userId },
    });
    count = article.totalLike - 1;

    // Like if not liked
    if (AlreadyLike.count == 0) {
      await this.prisma.userArticleLike.create({ data: { articleId: article.uuid, userId: userId } });
      count = article.totalLike + 1;
    }

    // Update total like
    await this.articlesService.update(uuid, { totalLike: count });

    return { liked: AlreadyLike.count === 0 };
  }
}
