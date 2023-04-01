import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { FindOrdersService, OrdersService, OrdersValidationService } from './services';
import { ArticlesModule } from '@articles/articles.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ClientsOrdersController } from './controllers/clients-orders.controller';

@Module({
  imports: [ArticlesModule, PrismaModule],
  controllers: [OrdersController, ClientsOrdersController],
  providers: [OrdersService, OrdersValidationService, FindOrdersService],
})
export class OrdersModule {}
