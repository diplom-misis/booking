/*
  Warnings:

  - You are about to drop the column `city` on the `Airport` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Airport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Airport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    CONSTRAINT "Airport_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Airport" ("code", "country", "id", "name") SELECT "code", "country", "id", "name" FROM "Airport";
DROP TABLE "Airport";
ALTER TABLE "new_Airport" RENAME TO "Airport";
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
