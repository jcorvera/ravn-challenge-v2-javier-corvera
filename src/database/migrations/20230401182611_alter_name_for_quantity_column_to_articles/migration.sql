/*
  Warnings:

  - You are about to drop the column `min_quantity` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "min_quantity",
DROP COLUMN "quantity",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
