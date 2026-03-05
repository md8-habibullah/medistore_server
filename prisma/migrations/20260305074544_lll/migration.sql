-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "category" SET DEFAULT 'others';

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");
