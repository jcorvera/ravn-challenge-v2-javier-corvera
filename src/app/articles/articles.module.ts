import { Module } from '@nestjs/common';
import {
  ArticlesService,
  CategoriesService,
  FindArticlesService,
  ImagesArticlesService,
  LikesArticlesService,
} from './services';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ArticlesController, ImagesArticlesController, publicArticlesController } from './controllers';
import { S3Module } from '@common/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [ArticlesController, publicArticlesController, ImagesArticlesController],
  providers: [ArticlesService, CategoriesService, LikesArticlesService, ImagesArticlesService, FindArticlesService],
})
export class ArticlesModule {}
