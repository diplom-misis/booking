-- Материализованное представление с минимальной суммарной ценой маршрута
-- по тройке (стартовый аэропорт IATA, конечный аэропорт IATA, дата вылета).
-- Используется аналитическим обработчиком /api/route-prices.

CREATE MATERIALIZED VIEW "mv_daily_min_prices" AS
WITH route_aggregates AS (
    SELECT
        fr."routeId",
        SUM(f.price)                                                       AS total_price,
        (array_agg(f."fromAirportId" ORDER BY fr."sequenceId" ASC))[1]     AS from_airport_id,
        (array_agg(f."toAirportId"   ORDER BY fr."sequenceId" DESC))[1]    AS to_airport_id,
        (array_agg(fr."flightDate"   ORDER BY fr."sequenceId" ASC))[1]::date AS departure_date
    FROM "FlightsRoutes" fr
    JOIN "Flight" f
      ON f."id" = fr."flightId" AND f."fromDatetime" = fr."flightDate"
    GROUP BY fr."routeId"
)
SELECT
    af.code         AS "fromAirportCode",
    at.code         AS "toAirportCode",
    departure_date  AS "departureDate",
    MIN(total_price) AS "minTotalPrice"
FROM route_aggregates ra
JOIN "Airport" af ON af.id = ra.from_airport_id
JOIN "Airport" at ON at.id = ra.to_airport_id
GROUP BY af.code, at.code, departure_date;

-- UNIQUE-индекс по ключевым измерениям требуется для REFRESH MATERIALIZED VIEW CONCURRENTLY.
CREATE UNIQUE INDEX "mv_daily_min_prices_unique"
    ON "mv_daily_min_prices" ("fromAirportCode", "toAirportCode", "departureDate");
