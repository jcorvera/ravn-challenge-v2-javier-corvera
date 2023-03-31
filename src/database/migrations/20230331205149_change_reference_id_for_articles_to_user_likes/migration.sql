/*
  Warnings:

  - The primary key for the `user_article_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "user_article_likes" DROP CONSTRAINT "user_article_likes_article_id_fkey";

-- AlterTable
ALTER TABLE "user_article_likes" DROP CONSTRAINT "user_article_likes_pkey",
ALTER COLUMN "article_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_article_likes_pkey" PRIMARY KEY ("user_id", "article_id");

-- AddForeignKey
ALTER TABLE "user_article_likes" ADD CONSTRAINT "user_article_likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
