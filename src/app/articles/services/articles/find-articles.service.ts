import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { QueryArticleDto } from '../../dto/query-article.dto';
import { pagination } from '@common/utils/index';
import { AuthResponseDoc } from '@app/auth/doc/auth-response.doc';
import { Role } from '@app/common/enums/roles.enum';

@Injectable()
export class FindArticlesService {
  constructor(private prisma: PrismaService, private categories: CategoriesService) {}

  async count(whereArticles = {}) {
    return this.prisma.article.count({ where: { deleted: false, ...whereArticles } });
  }

  async findByUuid(uuid: string) {
    return this.prisma.article.findFirst({ where: { uuid: uuid, deleted: false } });
  }

  async findOne(uuid: string, whereArticles = {}, whereLike = {}, additionalFields = {}) {
    const article = await this.prisma.article.findFirst({
      where: { uuid: uuid, deleted: false, ...whereArticles },
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
        ...additionalFields,
        ...whereLike,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  async findAll(queryArticleDto: QueryArticleDto, whereArticles = {}, whereLike = {}, additionalFields = {}) {
    const { page, pageSize, categoryId } = queryArticleDto;
    const total = await this.count(whereArticles);

    const articles = await this.prisma.article.findMany({
      where: { deleted: false, ...whereArticles, categoryId },
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
        ...additionalFields,
        ...whereLike,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { articles, ...pagination(total, page, pageSize) };
  }

  userIsClient(user: AuthResponseDoc) {
    return user.roles[0]?.role?.name === Role.Client;
  }

  publicFindOneArticle(uuid: string) {
    return this.findOne(uuid, { published: true });
  }

  publicFindAllArticles(queryArticleDto: QueryArticleDto) {
    return this.findAll(queryArticleDto, { published: true });
  }

  async findOneArticle(publicRoute: boolean, uuid: string, user?: AuthResponseDoc) {
    if (publicRoute) {
      return this.publicFindOneArticle(uuid);
    }

    if (user && this.userIsClient(user)) {
      return this.findOne(
        uuid,
        { published: true },
        { likes: { select: { userId: true }, where: { userId: user.id, articleId: uuid } } },
      );
    }

    return this.findOne(uuid);
  }

  async findAllArticles(publicRoute: boolean, queryArticleDto: QueryArticleDto, user?: AuthResponseDoc) {
    let category = {};

    if (publicRoute) {
      return this.publicFindAllArticles(queryArticleDto);
    }

    if (user && this.userIsClient(user)) {
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
