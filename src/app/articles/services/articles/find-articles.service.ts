import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { QueryArticleDto } from '../../dto/query-article.dto';
import { pagination, userIsClient } from '@common/utils/index';
import { AuthResponseDoc } from '@app/auth/doc/auth-response.doc';
import { ArticleResponseDoc } from '@app/articles/doc/article.response.doc';
import { ArticlePaginationResponseDoc } from '@articles/doc/article-pagination-response.doc';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FindArticlesService {
  constructor(private prisma: PrismaService) {}

  async count(whereArticles = {}): Promise<number> {
    return this.prisma.article.count({ where: { deleted: false, ...whereArticles } });
  }

  async findByUuid(uuid: string): Promise<ArticleResponseDoc> {
    return this.prisma.article.findFirst({ where: { uuid: uuid, deleted: false } });
  }

  async findOne(
    uuid: string,
    whereArticles = {},
    whereLike = {},
    additionalFields = {},
  ): Promise<ArticleResponseDoc | never> {
    const article = await this.prisma.article.findFirst({
      where: { uuid: uuid, deleted: false, ...whereArticles },
      select: {
        uuid: true,
        price: true,
        stock: true,
        published: true,
        title: true,
        description: true,
        categoryId: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        images: true,
        totalLike: true,
        ...additionalFields,
        ...whereLike,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }
    return plainToClass(ArticleResponseDoc, article);
  }

  async findAll(
    queryArticleDto: QueryArticleDto,
    whereArticles = {},
    whereLike = {},
    additionalFields = {},
  ): Promise<ArticlePaginationResponseDoc | never> {
    const { page, pageSize } = queryArticleDto;
    const total = await this.count(whereArticles);

    const articles = await this.prisma.article.findMany({
      where: { deleted: false, ...whereArticles },
      select: {
        uuid: true,
        price: true,
        stock: true,
        published: true,
        title: true,
        description: true,
        categoryId: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        images: true,
        totalLike: true,
        ...additionalFields,
        ...whereLike,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { articles, ...pagination(total, page, pageSize) };
  }

  publicFindOneArticle(uuid: string): Promise<ArticleResponseDoc | never> {
    return this.findOne(uuid, { published: true });
  }

  publicFindAllArticles(queryArticleDto: QueryArticleDto): Promise<ArticlePaginationResponseDoc | never> {
    return this.findAll(queryArticleDto, { published: true });
  }

  async findOneArticle(
    publicRoute: boolean,
    uuid: string,
    user?: AuthResponseDoc,
  ): Promise<ArticleResponseDoc | never> {
    if (publicRoute) {
      return this.publicFindOneArticle(uuid);
    }

    if (user && userIsClient(user)) {
      const article = await this.findOne(
        uuid,
        { published: true },
        { likes: { select: { userId: true }, where: { userId: user.id, articleId: uuid } } },
      );
      return plainToClass(ArticleResponseDoc, article);
    }

    return this.findOne(uuid);
  }

  async findAllArticles(
    publicRoute: boolean,
    queryArticleDto: QueryArticleDto,
    user?: AuthResponseDoc,
  ): Promise<ArticlePaginationResponseDoc | never> {
    let category = {};

    if (publicRoute) {
      return this.publicFindAllArticles(queryArticleDto);
    }

    if (user && userIsClient(user)) {
      return this.findAll(
        queryArticleDto,
        { published: true },
        { likes: { select: { userId: true }, where: { userId: user.id } } },
      );
    }

    if (queryArticleDto.categoryId) {
      category = { categoryId: +queryArticleDto.categoryId };
    }

    return this.findAll(queryArticleDto, { ...category });
  }
}
