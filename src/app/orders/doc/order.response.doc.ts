import { PaymentType } from '@app/common/types/payment-type.type';
import { OrderDetailResponseDoc } from './order-detail.response.doc';
import { UserResponseDoc } from '@users/doc/user.response.doc';

export class OrderResponseDoc {
  id?: number;
  uuid?: string;
  customer?: UserResponseDoc;
  customerId?: number;
  paymentType?: PaymentType;
  total?: number;
  detail?: OrderDetailResponseDoc[];
  createdAt?: Date;
}
