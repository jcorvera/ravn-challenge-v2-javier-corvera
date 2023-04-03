import { FindArticlesService } from '@app/articles/services';
import { formatCurrency } from '@common/utils';
import { CreateOrderDto, OrderDetailDto } from '@app/orders/dto/create-order.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleResponseDoc } from '@articles/doc/article.response.doc';
import { OrderDetailType, OrderType } from '@orders/types/order-detail.type';

@Injectable()
export class OrdersValidationService {
  constructor(private findArticlesService: FindArticlesService) {}

  async getArticles(createOrderDto: CreateOrderDto): Promise<ArticleResponseDoc[]> {
    const { orderDetail } = createOrderDto;

    return (
      await Promise.all(
        orderDetail.map((orderDetail: OrderDetailDto) => {
          return this.findArticlesService.findByUuid(orderDetail.productUuid);
        }),
      )
    ).filter((article: ArticleResponseDoc) => article !== null);
  }

  calculateTotalPrice(orderDetail: OrderDetailDto[], articles: ArticleResponseDoc[]): number {
    const totalPrice = orderDetail.reduce((total, orderDetail) => {
      const article = articles.find((article) => article.uuid === orderDetail.productUuid);
      return total + Number(article.price) * orderDetail.quantity;
    }, 0);

    return formatCurrency(totalPrice);
  }

  mapOrderDetail(orderDetail: OrderDetailDto[], articles: ArticleResponseDoc[]): OrderDetailType[] {
    const mapOrderDetail = orderDetail.map((orderDetail) => {
      const findArticle = articles.find((article: ArticleResponseDoc) => article.uuid === orderDetail.productUuid);
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

  validateQuantity(articles: ArticleResponseDoc[], createOrderDto: CreateOrderDto): void | never {
    const message: string[] = [];
    const { orderDetail } = createOrderDto;

    articles.forEach((article: ArticleResponseDoc) => {
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

  validateIfIdsAlreadyExist(articles: ArticleResponseDoc[], createOrderDto: CreateOrderDto): void | never {
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

  validateDuplicateIds(createOrderDto: CreateOrderDto): void | never {
    const { orderDetail } = createOrderDto;
    const orderDetailIds = orderDetail.map((orderDetail) => orderDetail.productUuid);
    const orderDetailIdsSet = new Set(orderDetailIds);

    if (orderDetailIds.length !== orderDetailIdsSet.size) {
      throw new BadRequestException(['The product uuids cannot be repeated']);
    }
  }

  async validateArticles(createOrderDto: CreateOrderDto): Promise<OrderType | never> {
    const articles = await this.getArticles(createOrderDto);
    this.validateIfIdsAlreadyExist(articles, createOrderDto);
    this.validateQuantity(articles, createOrderDto);
    this.validateDuplicateIds(createOrderDto);
    const total = this.calculateTotalPrice(createOrderDto.orderDetail, articles);
    const mapOrderDetail = this.mapOrderDetail(createOrderDto.orderDetail, articles);

    return {
      total,
      orderDetail: mapOrderDetail,
    };
  }
}
