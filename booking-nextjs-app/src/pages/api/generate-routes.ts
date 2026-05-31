import type { NextApiRequest, NextApiResponse } from "next";
import { generateRoutes } from "@/utils/routeGenerator";
import { DateTime } from "luxon";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Если передан startDate — обрабатываем только один 7-дневный чанк.
  // Иначе — оригинальное поведение: цикл по 12 месяцам в одной HTTP-функции.
  const startDateParam = req.query.startDate as string | undefined;

  if (startDateParam) {
    const startDate = DateTime.fromISO(startDateParam, { zone: "utc" });
    if (!startDate.isValid) {
      return res.status(400).json({
        message: "Invalid startDate (ожидается ISO-8601, например 2026-08-01T00:00:00Z)",
      });
    }

    try {
      const t0 = Date.now();
      await generateRoutes(startDate);
      const durationSec = (Date.now() - t0) / 1000;

      return res.status(200).json({
        message: "Chunk processed",
        start: startDate.toISO(),
        end: startDate.plus({ days: 7 }).toISO(),
        durationSec,
      });
    } catch (err) {
      console.error("[ROUTE_GENERATION_CHUNK_ERROR]", err);
      return res.status(500).json({
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // Fallback: оригинальный полный цикл (для обратной совместимости с _runGenerateRoutes.js)
  try {
    const startTime = Date.now();
    console.log("[ROUTE_GENERATION] Начало генерации маршрутов");

    const now = DateTime.utc();
    const endDate = now.plus({ months: 12 });
    let currentDate = now;

    while (currentDate < endDate) {
      const periodStart = currentDate.toISO();
      const periodEnd = currentDate.plus({ days: 6 }).toISO();
      console.log(`[ROUTE_GENERATION] Период: ${periodStart} - ${periodEnd}`);

      await generateRoutes(currentDate);
      currentDate = currentDate.plus({ days: 6 });
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`[ROUTE_GENERATION] Завершено за ${duration} секунд`);

    res.status(200).json({
      message: "Route generation complete",
      duration: `${duration} seconds`,
    });
  } catch (err) {
    console.error("[ROUTE_GENERATION_ERROR]", err);
    res.status(500).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
