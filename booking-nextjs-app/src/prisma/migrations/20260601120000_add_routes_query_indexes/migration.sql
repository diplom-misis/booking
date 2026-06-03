-- Индексы под OLTP-запрос /api/routes.

CREATE INDEX IF NOT EXISTS "Flight_fromAirportId_fromDatetime_idx"
  ON "Flight" ("fromAirportId", "fromDatetime");

CREATE INDEX IF NOT EXISTS "Flight_ticketClass_idx"
  ON "Flight" ("ticketClass");

CREATE INDEX IF NOT EXISTS "Flight_company_idx"
  ON "Flight" ("company");

CREATE INDEX IF NOT EXISTS "Flight_price_idx"
  ON "Flight" ("price");

CREATE INDEX IF NOT EXISTS "FlightsRoutes_flightId_flightDate_idx"
  ON "FlightsRoutes" ("flightId", "flightDate");

CREATE INDEX IF NOT EXISTS "FlightsRoutes_routeId_idx"
  ON "FlightsRoutes" ("routeId");
