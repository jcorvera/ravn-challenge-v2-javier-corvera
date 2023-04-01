import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { CategoriesService } from '../services/categories/categories.service';

@Public()
@ApiTags('Categories')
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Categories returned successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findAll() {
    return this.categoriesService.findAll();
  }
}
