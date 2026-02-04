-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SELLER', 'MANAGER', 'DEVELOPER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
