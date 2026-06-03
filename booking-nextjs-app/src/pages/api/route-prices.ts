import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { z } from "zod";

const querySchema = z.object({
  fromAirport: z.string().min(3).max(3),
  toAirport: z.string().min(3).max(3),
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

type Row = { departureDate: Date; minTotalPrice: number };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const parsedQuery = querySchema.parse(req.query);

    const startDate = new Date(
      Date.UTC(parsedQuery.year, parsedQuery.month - 1, 1),
    );
    const endDate = new Date(
      Date.UTC(parsedQuery.year, parsedQuery.month, 1),
    );

    const rows = await prisma.$queryRaw<Row[]>`
      SELECT "departureDate", "minTotalPrice"
        FROM "mv_daily_min_prices"
       WHERE "fromAirportCode" = ${parsedQuery.fromAirport}
         AND "toAirportCode"   = ${parsedQuery.toAirport}
         AND "departureDate"  >= ${startDate}
         AND "departureDate"   < ${endDate}
       ORDER BY "departureDate" ASC
    `;

    const result = rows.map((r) => ({
      date: r.departureDate.toISOString().slice(0, 10),
      minPrice: Math.round(r.minTotalPrice),
    }));

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    console.error("Error fetching daily min prices:", error);
    return res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: error }),
    });
  }
}
