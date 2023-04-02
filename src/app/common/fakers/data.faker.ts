import { faker } from '@faker-js/faker';
import { ArticleResponseDoc } from '@articles/doc/article.response.doc';
import { UpdateArticleDto, CreateArticleDto, QueryArticleDto } from '@app/articles/dto';
import { AuthResponseDoc } from '@auth/doc/auth-response.doc';
import { Role } from '../enums/roles.enum';
import { PaymentType } from '../enums/payment-type.enum';
import { QueryOrderDto } from '@app/orders/dto/query-order.dto';
import { CreateOrderDto } from '@app/orders/dto/create-order.dto';
import { articles } from '../../../database/seeds/data';

// -- Data
export const imagesFaker = Array.from({ length: 2 }).map(() => ({
  id: faker.datatype.number(),
  src: faker.image.fashion(),
  articleId: faker.datatype.number(),
}));

export const userArticleLikesFaker = Array.from({ length: 2 }).map(() => ({
  user: null,
  userId: +faker.datatype.number(),
  article: null,
  articleId: faker.datatype.uuid(),
  createdAt: faker.date.past(),
}));

export const categoriesFaker = Array.from({ length: 4 }).map(() => ({
  id: faker.datatype.number(),
  name: faker.commerce.department(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  article: null,
}));

export const articlesFaker = Array.from({ length: 5 }).map(() => ({
  id: faker.datatype.number(),
  uuid: faker.datatype.uuid(),
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  price: faker.datatype.number(),
  stock: faker.datatype.number(),
  published: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deleted: faker.datatype.boolean(),
  category: categoriesFaker[0],
  categoryId: categoriesFaker[0].id,
  images: imagesFaker,
  likes: [],
  orders: [],
  totalLike: faker.datatype.number(),
}));

export const mockFiles: Express.Multer.File[] = [
  {
    stream: null,
    fieldname: 'file1',
    originalname: 'file1.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    destination: '/path/to/uploads',
    filename: 'file1.jpg',
    path: '/path/to/uploads/file1.jpg',
    buffer: Buffer.from('file1 content'),
  },
];

export const orderDetailFaker = Array.from({ length: 1 }).map(() => ({
  id: faker.datatype.number(),
  articleName: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  price: faker.datatype.number(),
  quantity: faker.datatype.number(),
  total: faker.datatype.number(),
  article: null,
  articleId: faker.datatype.number(),
  order: null,
  orderId: faker.datatype.number(),
  createdAt: faker.date.past(),
}));

export const ordersFake = Array.from({ length: 5 }).map(() => ({
  id: 1,
  uuid: faker.datatype.uuid(),
  customer: null,
  customerId: faker.datatype.number(),
  paymentType: PaymentType.CASH,
  total: faker.datatype.number(),
  detail: [{ ...orderDetailFaker[0], orderId: 1 }],
  createdAt: faker.date.past(),
}));

// -- Dtos

export const createArticleFaker = (article: ArticleResponseDoc): CreateArticleDto => {
  return {
    title: article.title,
    description: article.description,
    price: article.price,
    stock: article.stock,
    published: article.published,
    categoryId: article.categoryId,
  };
};

export const updateArticleFaker = (article: ArticleResponseDoc): UpdateArticleDto => {
  return {
    title: article.title,
    description: article.description,
    price: article.price,
    stock: article.stock,
    published: article.published,
    categoryId: article.categoryId,
  };
};

export const queryArticleFaker = (page: number, pageSize: number, categoryId?: number): QueryArticleDto => {
  return {
    page: 1,
    pageSize: 10,
    categoryId,
  };
};

export const queryOrderFaker = (page: number, pageSize: number, customerUuid?: string): QueryOrderDto => {
  return {
    page: 1,
    pageSize: 10,
    customerUuid,
  };
};

export const authResponseDocFaker = (role: Role): AuthResponseDoc => {
  return {
    id: faker.datatype.number(),
    uuid: faker.datatype.uuid(),
    profilePicture: faker.image.fashion(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    accessToken: 'SDSDSDSD8SDSDSD...',
    refreshToken: 'SDSDSDSD8SDSDSD...',
    roles: [
      {
        roleId: 2,
        role: {
          name: role,
        },
      },
    ],
  };
};
