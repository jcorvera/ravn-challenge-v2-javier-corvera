import { PrismaClient } from '@prisma/client';
import { categories, roles, articles, manager, clients } from './data';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({ data: [...roles] });
  await prisma.category.createMany({ data: [...categories] });
  await prisma.user.create({ data: { ...manager } });

  const saveArticles = articles.map((article) => {
    return prisma.article.create({ data: { ...article } });
  });
  const saveClients = clients.map((client) => {
    return prisma.user.create({ data: { ...client } });
  });

  await Promise.all(saveArticles);
  await Promise.all(saveClients);
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
