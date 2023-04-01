import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../../dto/create-article.dto';
import { UpdateArticleDto } from '../../dto/update-article.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { QueryArticleDto } from '../../dto/query-article.dto';
import { pagination } from '@common/utils/index';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService, private categories: CategoriesService) {}

  async count(queryArticleDto: QueryArticleDto) {
    let whereArticles = {};
    if (queryArticleDto.categoryId) {
      whereArticles = { categoryId: +queryArticleDto.categoryId, deleted: false };
    }

    return this.prisma.article.count({ where: { deleted: false, ...whereArticles } });
  }

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

  async findAll(queryArticleDto: QueryArticleDto, userId?: number) {
    let likeIt = {};
    let whereArticles = {};
    const { page, pageSize } = queryArticleDto;
    const total = await this.count(queryArticleDto);

    if (userId) {
      likeIt = { likes: { select: { userId: true }, where: { userId: userId } } };
    }

    if (queryArticleDto.categoryId) {
      whereArticles = { categoryId: +queryArticleDto.categoryId, deleted: false };
    }

    const articles = await this.prisma.article.findMany({
      where: { deleted: false, ...whereArticles },
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
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { articles, ...pagination(total, page, pageSize) };
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

  async remove(uuid: string) {
    const article = await this.findByUuid(uuid);

    if (!article || article.deleted) {
      throw new NotFoundException();
    }
    return this.prisma.article.update({ where: { uuid }, data: { deleted: true } });
  }
}
