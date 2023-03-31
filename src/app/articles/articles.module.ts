import { Module } from '@nestjs/common';
import { ArticlesService, CategoriesService } from './services';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ArticlesController, publicArticlesController } from './controllers';

@Module({
  imports: [PrismaModule],
  controllers: [ArticlesController, publicArticlesController],
  providers: [ArticlesService, CategoriesService],
})
export class ArticlesModule {}
