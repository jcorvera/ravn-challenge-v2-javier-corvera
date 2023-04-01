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

@Public()
@ApiTags('Articles')
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('public/articles')
export class publicArticlesController {
  constructor(private readonly findArticlesService: FindArticlesService) {}

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findOne(@Param('uuid') uuid: string) {
    return this.findArticlesService.findOneArticle(true, uuid);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findAll(@Query() queryArticleDto: QueryArticleDto) {
    return this.findArticlesService.findAllArticles(true, queryArticleDto);
  }
}
