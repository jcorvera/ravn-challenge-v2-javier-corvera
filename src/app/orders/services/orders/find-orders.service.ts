import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthResponseDoc } from '@auth/doc/auth-response.doc';
import { pagination, userIsClient } from '@common/utils';
import { QueryOrderDto } from '../../dto/query-order.dto';
import { QueryPaginationDto } from '@common/dto/query-pagination.dto';

@Injectable()
export class FindOrdersService {
  constructor(private prisma: PrismaService) {}

  async count(whereArticles = {}) {
    return this.prisma.order.count({ where: { ...whereArticles } });
  }

  async findAll(queryPaginationDto: QueryPaginationDto, whereOrder = {}) {
    const { page, pageSize } = queryPaginationDto;
    const total = await this.count(whereOrder);

    const orders = await this.prisma.order.findMany({
      where: {
        ...whereOrder,
      },
      include: {
        detail: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { orders, ...pagination(total, page, pageSize) };
  }

  async findOne(uuid: string, whereArticle = {}) {
    const order = await this.prisma.order.findFirst({
      where: { uuid, ...whereArticle },
      include: {
        detail: true,
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async findOneOrder(uuid: string, user: AuthResponseDoc) {
    if (user && userIsClient(user)) {
      return this.findOne(uuid, { customer: { id: user.id } });
    }
    return this.findOne(uuid);
  }

  async findAllOrders(user: AuthResponseDoc, queryPaginationDto: QueryPaginationDto) {
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
