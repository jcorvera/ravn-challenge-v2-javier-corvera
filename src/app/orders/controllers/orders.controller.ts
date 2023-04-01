import { Controller, Request, HttpCode, HttpStatus, Get, Query, Param } from '@nestjs/common';
import { FindOrdersService } from '../services';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { QueryOrderDto } from '../dto/query-order.dto';

@ApiBearerAuth()
@ApiTooManyRequestsResponse({ description: 'Too Many Requests.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly findOrdersService: FindOrdersService) {}

  @Roles(Role.Manager)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Orders returned successfully.' })
  findAll(@Query() queryOrderDto: QueryOrderDto, @Request() req) {
    const { user } = req;
    return this.findOrdersService.findAllOrders(user, queryOrderDto);
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article found successfully.' })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findOne(@Param('uuid') uuid: string, @Request() req) {
    const { user } = req;
    return this.findOrdersService.findOneOrder(uuid, user);
  }
}
