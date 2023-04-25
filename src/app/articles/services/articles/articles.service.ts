import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../../dto/create-article.dto';
import { UpdateArticleDto } from '../../dto/update-article.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { FindArticlesService } from './find-articles.service';
import { ArticleResponseDoc } from '@app/articles/doc/article.response.doc';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categories: CategoriesService,
    private readonly findArticlesService: FindArticlesService,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<ArticleResponseDoc | never> {
    const category = await this.categories.findOne(createArticleDto.categoryId);
    if (!category) {
      throw new NotFoundException();
    }
    const article = await this.prisma.article.create({
      data: { ...createArticleDto },
      include: { category: true, images: true },
    });

    return plainToClass(ArticleResponseDoc, article);
  }

  async update(uuid: string, updateArticleDto: UpdateArticleDto): Promise<ArticleResponseDoc | never> {
    const article = await this.findArticlesService.findByUuid(uuid);
    if (!article) {
      throw new NotFoundException();
    }

    const result = await this.prisma.article.update({
      where: { uuid },
      data: { ...updateArticleDto },
      include: { category: true, images: true },
    });

    return plainToClass(ArticleResponseDoc, result);
  }

  async remove(uuid: string): Promise<void | never> {
    const article = await this.findArticlesService.findByUuid(uuid);

    if (!article) {
      throw new NotFoundException();
    }
    await this.prisma.article.update({ where: { uuid }, data: { deleted: true } });
  }
}
