import { S3Service } from '@common/s3/services/s3.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { FindArticlesService } from '../articles/find-articles.service';
import { ImagesUploadType, Src } from '@common/types/images-upload.type';
import { ArticleImageResponseDoc } from '@articles/doc/article-image.response.doc';

@Injectable()
export class ImagesArticlesService {
  constructor(
    private readonly s3Service: S3Service,
    private prisma: PrismaService,
    private findArticlesService: FindArticlesService,
  ) {}

  async saveImages(id: number, images: Src[]): Promise<ArticleImageResponseDoc[]> {
    const saveImages = images.map((image) => {
      return this.prisma.articleImage.create({ data: { src: image.src, articleId: id } });
    });

    return Promise.all(saveImages);
  }

  async uploadImages(uuid: string, images: Express.Multer.File[]): Promise<ImagesUploadType | never> {
    const article = await this.findArticlesService.findByUuid(uuid);
    if (!article) {
      throw new NotFoundException();
    }

    try {
      const imageUrls = await Promise.all(
        images.map((file: Express.Multer.File) => {
          return this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
        }),
      );
      const urls = imageUrls.map((url) => ({ src: url }));
      const response = await this.saveImages(article.id, urls);
      const imagesUrls = response.map((image) => ({ src: image.src, id: image.id }));

      return {
        articleUuid: article.uuid,
        images: imagesUrls,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
