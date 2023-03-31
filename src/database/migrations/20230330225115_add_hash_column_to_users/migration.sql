/*
  Warnings:

  - You are about to drop the `user_payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_payments" DROP CONSTRAINT "user_payments_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hash_refresh_token" TEXT;

-- DropTable
DROP TABLE "user_payments";
