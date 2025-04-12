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

  try {
    const startTime = Date.now();
    console.log("[ROUTE_GENERATION] Начало генерации маршрутов");

    const now = DateTime.utc();
    const endDate = now.plus({ months: 1 });
    let currentDate = now;

    while (currentDate < endDate) {
      const periodStart = currentDate.toISO();
      const periodEnd = currentDate.plus({ days: 6 }).toISO();

      console.log(
        `[ROUTE_GENERATION] Обработка периода: ${periodStart} - ${periodEnd}`,
      );

      await generateRoutes(currentDate);

      currentDate = currentDate.plus({ days: 6 });
      console.log(
        `[ROUTE_GENERATION] Завершено для периода: ${periodStart} - ${periodEnd}`,
      );
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`[ROUTE_GENERATION] Генерация завершена за ${duration} секунд`);

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
