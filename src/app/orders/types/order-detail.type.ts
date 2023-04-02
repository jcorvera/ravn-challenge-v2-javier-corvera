export type OrderDetailType = {
  articleName: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
  articleId: number;
};

export type OrderType = {
  total: number;
  orderDetail: OrderDetailType[];
};
