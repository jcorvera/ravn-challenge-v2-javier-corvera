import { PaginationResponseDoc } from '@common/doc/pagination-response.doc';
import { OrderResponseDoc } from './order.response.doc';

export class OrderPaginationResponseDoc extends PaginationResponseDoc {
  orders: OrderResponseDoc[];
}
