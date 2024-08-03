/*
  Warnings:

  - You are about to drop the column `resetPassWordAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPassWordAt",
ADD COLUMN     "resetPasswordCode" TEXT;
