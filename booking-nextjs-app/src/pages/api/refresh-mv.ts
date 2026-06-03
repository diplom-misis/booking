import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

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

  try {
    const t0 = Date.now();
    await prisma.$executeRawUnsafe(
      `REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_daily_min_prices"`,
    );
    const durationMs = Date.now() - t0;

    console.log(
      `[REFRESH_MV] mv_daily_min_prices refreshed in ${durationMs} ms`,
    );

    return res.status(200).json({
      message: "Materialized view refreshed",
      durationMs,
    });
  } catch (err) {
    console.error("[REFRESH_MV_ERROR]", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
