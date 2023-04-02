/*
  Warnings:

  - You are about to alter the column `price` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `order_details` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `order_details` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "order_details" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;
