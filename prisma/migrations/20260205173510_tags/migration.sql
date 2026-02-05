-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
