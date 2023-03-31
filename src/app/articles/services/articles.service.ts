import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { CategoriesService } from './categories.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService, private categories: CategoriesService) {}

  async findByUuid(uuid: string) {
    return this.prisma.article.findUnique({ where: { uuid: uuid } });
  }

  async findOne(uuid: string, userId?: number) {
    let likeIt = {};
    if (userId) {
      likeIt = { likes: { select: { userId: true }, where: { userId: userId, articleId: uuid } } };
    }

    const article = await this.prisma.article.findUnique({
      where: { uuid: uuid },
      select: {
        uuid: true,
        title: true,
        description: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        images: true,
        totalLike: true,
        ...likeIt,
      },
    });

    if (!article || article.deleted) {
      throw new NotFoundException();
    }

    return article;
  }

  async findAll(userId?: number) {
    let likeIt = {};
    if (userId) {
      likeIt = { likes: { select: { userId: true }, where: { userId: userId } } };
    }

    return this.prisma.article.findMany({
      where: { deleted: false },
      select: {
        uuid: true,
        title: true,
        description: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        images: true,
        totalLike: true,
        ...likeIt,
      },
    });
  }

  async create(createArticleDto: CreateArticleDto) {
    const category = await this.categories.findOne(createArticleDto.categoryId);
    if (!category) {
      throw new NotFoundException();
    }
    return this.prisma.article.create({ data: { ...createArticleDto } });
  }

  async update(uuid: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.findByUuid(uuid);
    if (!article || article.deleted) {
      throw new NotFoundException();
    }

    return this.prisma.article.update({ where: { uuid }, data: { ...updateArticleDto } });
  }

  async likeArticle(uuid: string, userId: number) {
    let count = 0;
    const article = await this.findByUuid(uuid);

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
    await this.update(uuid, { totalLike: count });

    return { liked: AlreadyLike.count === 0 };
  }

  async remove(uuid: string) {
    const article = await this.findByUuid(uuid);

    if (!article || article.deleted) {
      throw new NotFoundException();
    }
    return this.prisma.article.update({ where: { uuid }, data: { deleted: true } });
  }
}
