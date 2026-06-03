-- Партиционирование FlightsRoutes по flightDate.
-- Каскадное партиционирование вместе с Flight для корректного DROP старых партиций.
-- На момент применения миграции таблица предполагается пустой (TRUNCATE Route CASCADE применён ранее).

-- 1. Удаляем существующую (пустую) таблицу. CASCADE — на случай висящих FK/индексов.
DROP TABLE IF EXISTS "FlightsRoutes" CASCADE;

-- 2. Создаём партиционированную таблицу с композитным PK
CREATE TABLE "FlightsRoutes" (
  "id"         TEXT NOT NULL,
  "sequenceId" INTEGER NOT NULL,
  "flightId"   TEXT NOT NULL,
  "flightDate" TIMESTAMP(3) NOT NULL,
  "routeId"    TEXT NOT NULL,
  CONSTRAINT "FlightsRoutes_pkey" PRIMARY KEY ("id", "flightDate")
) PARTITION BY RANGE ("flightDate");

-- 3. Дефолтная партиция (буфер для строк, не попавших в явные диапазоны)
CREATE TABLE "FlightsRoutes_default" PARTITION OF "FlightsRoutes" DEFAULT;

-- 4. Уникальный индекс (требование PG: ключ партиционирования включается в каждый unique-индекс)
CREATE UNIQUE INDEX "FlightsRoutes_sequenceId_routeId_flightDate_key"
  ON "FlightsRoutes" ("sequenceId", "routeId", "flightDate");

-- 5. Внешние ключи
ALTER TABLE "FlightsRoutes"
  ADD CONSTRAINT "FlightsRoutes_flightId_flightDate_fkey"
  FOREIGN KEY ("flightId", "flightDate") REFERENCES "Flight"("id", "fromDatetime")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "FlightsRoutes"
  ADD CONSTRAINT "FlightsRoutes_routeId_fkey"
  FOREIGN KEY ("routeId") REFERENCES "Route"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. Месячные партиции для текущих и будущих 14 месяцев
DO $$
DECLARE
  m int;
  start_date timestamp;
  end_date   timestamp;
  partition_name text;
BEGIN
  FOR m IN 0..13 LOOP
    start_date := date_trunc('month', now() + (m || ' months')::interval);
    end_date   := start_date + interval '1 month';
    partition_name := 'FlightsRoutes_' || to_char(start_date, 'YYYY_MM');

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF "FlightsRoutes" FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
  END LOOP;
END $$;
