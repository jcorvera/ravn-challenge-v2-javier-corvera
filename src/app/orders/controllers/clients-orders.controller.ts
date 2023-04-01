import { Controller, Post, Request, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { FindOrdersService, OrdersService } from '../services';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { QueryPaginationDto } from '@common/dto/query-pagination.dto';

@Roles(Role.Client)
@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiTags('Orders')
@Controller('orders')
export class ClientsOrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly findOrdersService: FindOrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Article created successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const { user } = req;
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('mine-orders')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Orders returned successfully.' })
  findAll(@Query() queryPaginationDto: QueryPaginationDto, @Request() req) {
    const { user } = req;
    return this.findOrdersService.findAllOrders(user, queryPaginationDto);
  }
}
