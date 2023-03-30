import { faker } from '@faker-js/faker';

export const roles = [
  {
    name: 'Admin',
  },
  {
    name: 'Manager',
  },
  {
    name: 'Client',
  },
];

export const categories = [
  {
    name: 'Casual',
  },
  {
    name: 'Business',
  },
  {
    name: 'Formal',
  },
  {
    name: 'Lingerie',
  },
  {
    name: 'Sportswear',
  },
];

export const images = Array.from({ length: Math.random() * 5 + 1 }).map(() => ({
  src: faker.image.fashion(),
}));

export const admin = {
  profilePicture: faker.image.avatar(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.number(),
  password: 'password', // Password
  roles: {
    create: {
      roleId: 1,
    },
  },
};

export const articles = Array.from({ length: 100 }).map(() => ({
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price(),
  published: faker.datatype.boolean(),
  categoryId: Math.floor(Math.random() * 5 + 1),
  totalLike: Math.floor(Math.random() * 100),
  images: {
    createMany: {
      data: [...images],
    },
  },
}));

export const managers = Array.from({ length: 2 }).map(() => ({
  profilePicture: faker.image.avatar(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.number(),
  password: 'password', // Password
  roles: {
    create: {
      roleId: 2,
    },
  },
}));

export const clients = Array.from({ length: 4 }).map(() => ({
  profilePicture: faker.image.avatar(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.number(),
  password: 'password', // Password
  roles: {
    create: {
      roleId: 3,
    },
  },
  address: {
    create: {
      city: faker.address.city(),
      address: faker.address.direction(),
      postalCode: faker.address.zipCode(),
    },
  },
}));
