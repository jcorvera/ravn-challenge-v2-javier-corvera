-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "totalLike" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_article_likes" (
    "user_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_article_likes_pkey" PRIMARY KEY ("user_id","article_id")
);

-- AddForeignKey
ALTER TABLE "user_article_likes" ADD CONSTRAINT "user_article_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_article_likes" ADD CONSTRAINT "user_article_likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
