import { PrismaClient } from '@prisma/client';
import { categories, roles, articles, managers, clients, admin } from './data';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({ data: [...roles] });
  await prisma.category.createMany({ data: [...categories] });
  await prisma.user.create({ data: { ...admin } });

  const saveArticles = articles.map((article) => {
    return prisma.article.create({ data: { ...article } });
  });
  const saveManagers = managers.map((manager) => {
    return prisma.user.create({ data: { ...manager } });
  });
  const saveClients = clients.map((client) => {
    return prisma.user.create({ data: { ...client } });
  });

  await Promise.all(saveArticles);
  await Promise.all(saveManagers);
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
