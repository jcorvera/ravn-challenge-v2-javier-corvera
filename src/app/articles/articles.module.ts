import { Module } from '@nestjs/common';
import {
  ArticlesService,
  CategoriesService,
  FindArticlesService,
  ImagesArticlesService,
  LikesArticlesService,
} from './services';
import { PrismaModule } from '@app/prisma/prisma.module';
import {
  ArticlesController,
  ImagesArticlesController,
  PublicArticlesController,
  PublicCategoriesController,
} from './controllers';
import { S3Module } from '@common/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [ArticlesController, PublicArticlesController, ImagesArticlesController, PublicCategoriesController],
  providers: [ArticlesService, CategoriesService, LikesArticlesService, ImagesArticlesService, FindArticlesService],
})
export class ArticlesModule {}
