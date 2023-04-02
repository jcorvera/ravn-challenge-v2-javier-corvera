import { Controller, Get, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { QueryArticleDto } from '../dto/query-article.dto';
import { FindArticlesService } from '../services';
import { ArticleResponseDoc } from '../doc/article.response.doc';
import { ArticlePaginationResponseDoc } from '../doc/article-pagination-response.doc';

@Public()
@ApiTags('Articles')
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('public/articles')
export class PublicArticlesController {
  constructor(private readonly findArticlesService: FindArticlesService) {}

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findOne(@Param('uuid') uuid: string): Promise<ArticleResponseDoc | never> {
    return this.findArticlesService.findOneArticle(true, uuid);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles returned successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findAll(@Query() queryArticleDto: QueryArticleDto): Promise<ArticlePaginationResponseDoc | never> {
    return this.findArticlesService.findAllArticles(true, queryArticleDto);
  }
}
