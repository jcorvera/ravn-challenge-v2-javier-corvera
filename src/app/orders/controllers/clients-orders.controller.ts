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
import { OrderPaginationResponseDoc } from '../doc/order-pagination.response.doc';
import { OrderResponseDoc } from '../doc/order.response.doc';

@Roles(Role.Client)
@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiTags('Orders')
@Controller()
export class ClientsOrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly findOrdersService: FindOrdersService) {}

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Article created successfully.' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<OrderResponseDoc | never> {
    const { user } = req;
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('/my-orders')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Orders returned successfully.' })
  findAll(
    @Query() queryPaginationDto: QueryPaginationDto,
    @Request() req,
  ): Promise<OrderPaginationResponseDoc | never> {
    const { user } = req;
    return this.findOrdersService.findAllOrders(queryPaginationDto, user);
  }
}
