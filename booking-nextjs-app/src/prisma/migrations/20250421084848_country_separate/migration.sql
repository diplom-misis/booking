BEGIN;

-- Создаем таблицу Country
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- Создаем уникальный индекс для названий стран
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- Вставляем уникальные страны из Airport в новую таблицу Country
INSERT INTO "Country" ("id", "name")
SELECT 
    gen_random_uuid()::TEXT, 
    "country"
FROM (
    SELECT DISTINCT "country" 
    FROM "Airport" 
    WHERE "country" IS NOT NULL
) AS unique_countries;

-- Добавляем countryId в City и заполняем данными
ALTER TABLE "City" ADD COLUMN "countryId" TEXT;
UPDATE "City" c
SET "countryId" = co."id"
FROM "Airport" a
JOIN "Country" co ON a."country" = co."name"
WHERE a."cityId" = c."id";

-- Добавляем defaultCountryId в User (опциональное поле)
ALTER TABLE "User" ADD COLUMN "defaultCountryId" TEXT;

-- Удаляем старый столбец country из Airport
ALTER TABLE "Airport" DROP COLUMN "country";

-- Добавляем внешние ключи
ALTER TABLE "User" ADD CONSTRAINT "User_defaultCountryId_fkey" 
FOREIGN KEY ("defaultCountryId") REFERENCES "Country"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" 
FOREIGN KEY ("countryId") REFERENCES "Country"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
