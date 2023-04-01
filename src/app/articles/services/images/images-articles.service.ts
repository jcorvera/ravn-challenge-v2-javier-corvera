import { S3Service } from '@common/s3/services/s3.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';
import { PrismaService } from '@app/prisma/prisma.service';

type Src = {
  src: string;
};

@Injectable()
export class ImagesArticlesService {
  constructor(
    private readonly s3Service: S3Service,
    private articlesService: ArticlesService,
    private prisma: PrismaService,
  ) {}

  async saveImages(id: number, images: Src[]) {
    const saveImages = images.map((image) => {
      return this.prisma.articleImage.create({ data: { src: image.src, articleId: id } });
    });

    await Promise.all(saveImages);
  }

  async uploadImages(uuid: string, images: Express.Multer.File[]) {
    const article = await this.articlesService.findByUuid(uuid);
    if (!article) {
      throw new NotFoundException();
    }

    const imageUrls = await Promise.all(
      images.map(async (file: Express.Multer.File) => {
        return this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
      }),
    );

    const urls = imageUrls.map((url) => ({ src: url }));
    await this.saveImages(article.id, urls);

    return {
      images: urls,
    };
  }
}
