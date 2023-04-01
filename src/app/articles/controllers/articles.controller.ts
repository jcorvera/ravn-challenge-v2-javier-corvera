import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';
import { ArticlesService, LikesArticlesService } from '../services';
import { CreateArticleDto, QueryArticleDto, UpdateArticleDto } from '../dto';

@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly likesArticlesService: LikesArticlesService,
  ) {}

  @Roles(Role.Manager)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Article created successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateArticleDto })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findOne(@Param('uuid') id: string, @Request() req) {
    return this.articlesService.findOne(id, req.user ? +req.user.id : null);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findAll(@Query() queryArticleDto: QueryArticleDto, @Request() req) {
    const role = req.user ? req.user.roles[0].role.name : null;
    if (role === Role.Client) {
      return this.articlesService.findAll(null, req.user ? +req.user.id : null);
    }
    return this.articlesService.findAll(queryArticleDto);
  }

  @Roles(Role.Client)
  @Post('likes/:uuid')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Like posted successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  likeArticle(@Param('uuid') id: string, @Request() req) {
    return this.likesArticlesService.likeArticle(id, req.user ? +req.user.id : null);
  }

  @Roles(Role.Manager)
  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article updated successfully.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(@Param('uuid') uuid: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(uuid, updateArticleDto);
  }

  @Roles(Role.Manager)
  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Article deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('uuid') uuid: string) {
    return this.articlesService.remove(uuid);
  }
}
