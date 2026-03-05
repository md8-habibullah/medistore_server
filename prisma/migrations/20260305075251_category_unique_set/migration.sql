/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_category_fkey";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "id";

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_category_fkey" FOREIGN KEY ("category") REFERENCES "categories"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
