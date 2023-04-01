/*
  Warnings:

  - You are about to drop the column `quentity` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "quentity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
