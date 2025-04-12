/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flightNumber` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromAirportId" TEXT NOT NULL,
    "fromDatetime" DATETIME NOT NULL,
    "toAirportId" TEXT NOT NULL,
    "toDatetime" DATETIME NOT NULL,
    "company" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "ticketClass" TEXT NOT NULL DEFAULT 'ECONOMY',
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Flight_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("company", "createdAt", "fromAirportId", "fromDatetime", "id", "price", "toAirportId", "toDatetime", "updatedAt") SELECT "company", "createdAt", "fromAirportId", "fromDatetime", "id", "price", "toAirportId", "toDatetime", "updatedAt" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
CREATE TABLE "new_Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL
);
INSERT INTO "new_Route" ("id") SELECT "id" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE UNIQUE INDEX "Route_hash_key" ON "Route"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");
