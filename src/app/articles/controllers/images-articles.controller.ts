import { Controller, Post, Param, HttpCode, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';
import { imageMulterOptions, swaggerSchemaBodyForFileArray } from '@app/common/utils';
import { ImagesArticlesService } from '../services/images/images-articles.service';
import { ImagesUploadType } from '@common/types/images-upload.type';

@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiTags('Images-articles')
@Controller('articles/images')
export class ImagesArticlesController {
  constructor(private readonly imagesArticlesService: ImagesArticlesService) {}

  @Roles(Role.Manager)
  @Post(':uuid')
  @UseInterceptors(FilesInterceptor('images', 10, imageMulterOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody(swaggerSchemaBodyForFileArray)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Images stored successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findOne(@Param('uuid') uuid: string, @UploadedFiles() files: Express.Multer.File[]): Promise<ImagesUploadType> {
    return this.imagesArticlesService.uploadImages(uuid, files);
  }
}
