import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { OrdersValidationService } from '../validations/orders-validation.service';
import { AuthResponseDoc } from '@auth/doc/auth-response.doc';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private ordersValidationService: OrdersValidationService, private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, user: AuthResponseDoc) {
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
        include: {
          detail: true,
          customer: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
