/*
  Warnings:

  - You are about to drop the column `classFee2027` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `classFee2028` on the `Setting` table. All the data in the column will be lost.
  - Added the required column `fee2027Paper` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee2027Theory` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee2028Paper` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee2028Theory` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "classFee2027",
DROP COLUMN "classFee2028",
ADD COLUMN     "fee2027Paper" INTEGER NOT NULL,
ADD COLUMN     "fee2027Theory" INTEGER NOT NULL,
ADD COLUMN     "fee2028Paper" INTEGER NOT NULL,
ADD COLUMN     "fee2028Theory" INTEGER NOT NULL;
