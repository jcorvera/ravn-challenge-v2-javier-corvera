import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthResponseDoc } from '@auth/doc/auth-response.doc';
import { pagination, selectColumnsFromArticle, userIsClient } from '@common/utils';
import { QueryOrderDto } from '../../dto/query-order.dto';
import { QueryPaginationDto } from '@common/dto/query-pagination.dto';
import { OrderResponseDoc } from '@orders/doc/order.response.doc';
import { OrderPaginationResponseDoc } from '@orders/doc/order-pagination.response.doc';

@Injectable()
export class FindOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async count(whereArticles = {}): Promise<number> {
    return this.prisma.order.count({ where: { ...whereArticles } });
  }

  async findAll(queryPaginationDto: QueryPaginationDto, whereOrder = {}): Promise<OrderPaginationResponseDoc> {
    const { page, pageSize } = queryPaginationDto;
    const total = await this.count(whereOrder);

    const orders = await this.prisma.order.findMany({
      select: { ...selectColumnsFromArticle },
      where: {
        ...whereOrder,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { orders, ...pagination(total, page, pageSize) };
  }

  async findOne(uuid: string, whereArticle = {}): Promise<OrderResponseDoc | never> {
    const order = await this.prisma.order.findFirst({
      select: { ...selectColumnsFromArticle },
      where: { uuid, ...whereArticle },
    });

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async findOneOrder(uuid: string, user: AuthResponseDoc): Promise<OrderResponseDoc | never> {
    if (user && userIsClient(user)) {
      return this.findOne(uuid, { customer: { id: user.id } });
    }
    return this.findOne(uuid);
  }

  async findAllOrders(
    queryPaginationDto: QueryPaginationDto,
    user: AuthResponseDoc,
  ): Promise<OrderPaginationResponseDoc> {
    let customerQuery = {};
    if (user && userIsClient(user)) {
      return this.findAll(queryPaginationDto, { customer: { id: user.id } });
    }

    const castQueryPaginationDto = queryPaginationDto as QueryOrderDto;
    if (castQueryPaginationDto.customerUuid) {
      customerQuery = { customer: { uuid: castQueryPaginationDto.customerUuid } };
    }

    return this.findAll(queryPaginationDto, customerQuery);
  }
}
