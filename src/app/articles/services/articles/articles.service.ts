import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../../dto/create-article.dto';
import { UpdateArticleDto } from '../../dto/update-article.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { FindArticlesService } from './find-articles.service';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private categories: CategoriesService,
    private findArticlesService: FindArticlesService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const category = await this.categories.findOne(createArticleDto.categoryId);
    if (!category) {
      throw new NotFoundException();
    }
    return this.prisma.article.create({ data: { ...createArticleDto } });
  }

  async update(uuid: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.findArticlesService.findByUuid(uuid);
    if (!article) {
      throw new NotFoundException();
    }

    return this.prisma.article.update({ where: { uuid }, data: { ...updateArticleDto } });
  }

  async remove(uuid: string) {
    const article = await this.findArticlesService.findByUuid(uuid);

    if (!article) {
      throw new NotFoundException();
    }
    return this.prisma.article.update({ where: { uuid }, data: { deleted: true } });
  }
}
