import type { NextApiRequest, NextApiResponse } from "next";
import { generateRoutes } from "@/utils/routeGenerator";
import { DateTime } from "luxon";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const updates = [{ oldName: "Russia", newName: "Россия" }];

  for (const { oldName, newName } of updates) {
    await prisma.country.updateMany({
      where: { name: oldName },
      data: { name: newName },
    });
  }

  console.log("Обновление завершено.");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const startTime = Date.now();
    console.log("[ROUTE_GENERATION] Начало генерации маршрутов");

    const now = DateTime.utc();
    const endDate = now.plus({ months: 12 });
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
