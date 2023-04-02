import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { OrdersValidationService } from '../validations/orders-validation.service';
import { AuthResponseDoc } from '@auth/doc/auth-response.doc';
import { PrismaService } from '@app/prisma/prisma.service';
import { OrderResponseDoc } from '@orders/doc/order.response.doc';
import { selectColumnsFromArticle } from '@app/common/utils';

@Injectable()
export class OrdersService {
  constructor(private ordersValidationService: OrdersValidationService, private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, user: AuthResponseDoc): Promise<OrderResponseDoc | never> {
    const { total, orderDetail } = await this.ordersValidationService.validateArticles(createOrderDto);

    try {
      return this.prisma.order.create({
        data: {
          total,
          paymentType: createOrderDto.paymentType,
          customerId: user.id,
          detail: {
            createMany: {
              data: [...orderDetail],
            },
          },
        },
        select: { ...selectColumnsFromArticle },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
