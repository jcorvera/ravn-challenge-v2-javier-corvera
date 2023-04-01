import { FindArticlesService } from '@app/articles/services';
import { formatCurrency } from '@common/utils';
import { CreateOrderDto, OrderDetailDto } from '@app/orders/dto/create-order.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';

@Injectable()
export class OrdersValidationService {
  constructor(private findArticlesService: FindArticlesService) {}

  async getArticles(createOrderDto: CreateOrderDto) {
    const { orderDetail } = createOrderDto;

    return (
      await Promise.all(
        orderDetail.map((orderDetail: OrderDetailDto) => {
          return this.findArticlesService.findByUuid(orderDetail.productUuid);
        }),
      )
    ).filter((article: Article) => article !== null);
  }

  calculateTotalPrice(orderDetail: OrderDetailDto[], articles: Article[]) {
    const totalPrice = orderDetail.reduce((total, orderDetail) => {
      const article = articles.find((article) => article.uuid === orderDetail.productUuid);
      return total + Number(article.price) * orderDetail.quantity;
    }, 0);

    return formatCurrency(totalPrice);
  }

  mapOrderDetail(orderDetail: OrderDetailDto[], articles: Article[]) {
    const mapOrderDetail = orderDetail.map((orderDetail) => {
      const findArticle = articles.find((article: Article) => article.uuid === orderDetail.productUuid);
      const total = Number(findArticle.price) * orderDetail.quantity;
      return {
        articleName: findArticle.title,
        description: findArticle.description,
        price: findArticle.price,
        quantity: orderDetail.quantity,
        total: formatCurrency(total),
        articleId: findArticle.id,
      };
    });

    return mapOrderDetail;
  }

  async validateQuantity(articles: Article[], createOrderDto: CreateOrderDto) {
    const message: string[] = [];
    const { orderDetail } = createOrderDto;

    articles.forEach((article: Article) => {
      const orderDetailDto = orderDetail.find(
        (orderDetail: OrderDetailDto) => orderDetail.productUuid === article.uuid,
      );
      if (orderDetailDto.quantity > article.stock) {
        message.push(`The product with uuid ${article.uuid} has a stock of ${article.stock}`);
      }
    });

    if (message.length > 0) {
      throw new BadRequestException(message);
    }
  }

  async validateIfIdsAlreadyExist(articles: Article[], createOrderDto: CreateOrderDto) {
    const message: string[] = [];
    const { orderDetail } = createOrderDto;
    const articlesIds = articles.map((article) => article.uuid);

    orderDetail.forEach((orderDetail: OrderDetailDto) => {
      if (!articlesIds.includes(orderDetail.productUuid)) {
        message.push(`The product with uuid ${orderDetail.productUuid} does not exist`);
      }
    });

    if (message.length > 0) {
      throw new BadRequestException(message);
    }
  }

  async validateArticles(createOrderDto: CreateOrderDto) {
    const articles = await this.getArticles(createOrderDto);
    await this.validateIfIdsAlreadyExist(articles, createOrderDto);
    await this.validateQuantity(articles, createOrderDto);
    const total = this.calculateTotalPrice(createOrderDto.orderDetail, articles);
    const mapOrderDetail = this.mapOrderDetail(createOrderDto.orderDetail, articles);

    return {
      total,
      orderDetail: mapOrderDetail,
    };
  }
}
