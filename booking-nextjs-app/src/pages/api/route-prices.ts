import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { z } from "zod";
import { DateTime } from "luxon";

const querySchema = z.object({
  fromAirport: z.string().min(3).max(3),
  toAirport: z.string().min(3).max(3),
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const parsedQuery = querySchema.parse(req.query);

    const startDate = new Date(parsedQuery.year, parsedQuery.month - 1, 1);
    const endDate = new Date(parsedQuery.year, parsedQuery.month, 0);
    endDate.setHours(23, 59, 59, 999);

    const potentialRoutes = await prisma.route.findMany({
      where: {
        flightRoutes: {
          some: {
            sequenceId: 0,
            flight: {
              fromAirport: { code: parsedQuery.fromAirport },
              fromDatetime: { gte: startDate, lte: endDate }
            }
          }
        }
      },
      include: {
        flightRoutes: {
          orderBy: { sequenceId: "asc" },
          include: {
            flight: {
              include: {
                fromAirport: true,
                toAirport: true,
              },
            },
          },
        },
      },
    });

    const validRoutes = potentialRoutes.filter(route => {
      const flights = route.flightRoutes.map(fr => fr.flight);
      return flights[flights.length - 1].toAirport.code === parsedQuery.toAirport;
    });

    const filteredRoutes = validRoutes.filter((route) => {
      const flights = route.flightRoutes.map(fr => fr.flight);
      
      for (let i = 0; i < flights.length - 1; i++) {
        if (flights[i].toAirport.code !== flights[i + 1].fromAirport.code) {
          return false;
        }
      }
      
      return true;
    });

    const dailyMinPrices: Record<string, number> = {};

    for (const route of filteredRoutes) {
      const flights = route.flightRoutes.map(fr => fr.flight);
      const totalPrice = flights.reduce((sum, flight) => sum + flight.price, 0);
      
      const dateKey = DateTime.fromJSDate(flights[0].fromDatetime).toFormat('yyyy-MM-dd');
      
      if (!dailyMinPrices[dateKey] || totalPrice < dailyMinPrices[dateKey]) {
        dailyMinPrices[dateKey] = Math.round(totalPrice);
      }
    }

    const result = Object.entries(dailyMinPrices).map(([date, minPrice]) => ({
      date,
      minPrice,
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