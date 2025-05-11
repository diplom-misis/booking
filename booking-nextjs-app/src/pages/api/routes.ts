import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { z } from "zod";

const querySchema = z
  .object({
    fromAirport: z.string().min(3).max(3),
    toAirport: z.string().min(3).max(3),
    ticketClass: z.enum(["ECONOMY", "COMFORT", "BUSINESS", "FIRST"]).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    departureDate: z.coerce.date().optional(),
    arrivalDate: z.coerce.date().optional(),
    allowedStops: z
      .union([
        z.coerce.number().int().min(0).max(3).array(),
        z.coerce.number().int().min(0).max(3),
      ])
      .default([])
      .transform((val) => (Array.isArray(val) ? val : [val])),
    airline: z.union([z.string(), z.array(z.string())]).optional(),
    sortByPrice: z.enum(["asc", "desc"]).optional(),
    passengers: z.coerce.number().int().min(1).default(1),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(4),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return data.maxPrice >= data.minPrice;
      }
      return true;
    },
    {
      message: "maxPrice must be greater than or equal to minPrice",
      path: ["maxPrice"],
    },
  );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const parsedQuery = querySchema.parse({
      ...req.query,
      airline: req.query.airline
        ? Array.isArray(req.query.airline)
          ? req.query.airline
          : [req.query.airline]
        : undefined,
    });

    const whereClause = {
      ...(parsedQuery.ticketClass && {
        ticketClass: parsedQuery.ticketClass,
      }),
      ...(parsedQuery.airline && {
        company: { in: parsedQuery.airline as string[] },
      }),
      ...(parsedQuery.minPrice || parsedQuery.maxPrice
        ? {
            price: {
              ...(parsedQuery.minPrice !== undefined && {
                gte: parsedQuery.minPrice,
              }),
              ...(parsedQuery.maxPrice !== undefined && {
                lte: parsedQuery.maxPrice,
              }),
            },
          }
        : {}),
      ...(parsedQuery.departureDate && {
        fromDatetime: {
          gte: parsedQuery.departureDate,
          lt: new Date(
            parsedQuery.departureDate.getTime() + 24 * 60 * 60 * 1000,
          ),
        },
      }),
    };

    const flights = await prisma.flight.findMany({
      where: whereClause,
      include: {
        flightRoutes: {
          include: {
            route: {
              include: {
                flightRoutes: {
                  orderBy: { sequenceId: "asc" },
                  include: {
                    flight: {
                      include: {
                    fromAirport: { include: { city: true } },
                    toAirport: { include: { city: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        fromAirport: true,
        toAirport: true,
      },
    });

    const routes = await prisma.route.findMany({
      where: {
        id: {
          in: [
            ...new Set(
              flights.flatMap((f) =>
                f.flightRoutes.map((fr) => fr.route.id),
              ),
            ),
          ],
        },
      },
      include: {
        flightRoutes: {
          orderBy: { sequenceId: "asc" },
          include: {
            flight: {
              include: {
                fromAirport: { include: { city: true } },
                toAirport: { include: { city: true } },
              },
            },
          },
        },
      },
    });

    const validRoutes = routes.filter((route) => {
      const flights = route.flightRoutes.map((fr) => fr.flight);

      if (flights[0].fromAirport.code !== parsedQuery.fromAirport) return false;
      if (flights[flights.length - 1].toAirport.code !== parsedQuery.toAirport)
        return false;

      for (let i = 0; i < flights.length - 1; i++) {
        if (flights[i].toAirport.code !== flights[i + 1].fromAirport.code) {
          return false;
        }
      }

      if (parsedQuery.airline && parsedQuery.airline.length > 0) {
        const hasMatchingAirline = flights.some(flight => 
          parsedQuery.airline?.includes(flight.company)
        );
        if (!hasMatchingAirline) return false;
      }

      return true;
    });

    const filteredRoutes = parsedQuery.allowedStops.length
      ? validRoutes.filter((route) =>
          parsedQuery.allowedStops.includes(route.flightRoutes.length - 1)
        )
      : validRoutes;

    const sortedRoutes = [...filteredRoutes].sort((a, b) => {
      const priceA = a.flightRoutes.reduce((sum, fr) => sum + fr.flight.price, 0);
      const priceB = b.flightRoutes.reduce((sum, fr) => sum + fr.flight.price, 0);
      
      return parsedQuery.sortByPrice === 'desc' 
        ? priceB - priceA 
        : priceA - priceB;
    });

    const startIndex = (parsedQuery.page - 1) * parsedQuery.limit;
    const endIndex = parsedQuery.page * parsedQuery.limit;
    const paginatedRoutes = sortedRoutes.slice(startIndex, endIndex);

    const result = paginatedRoutes.map((route) => {
      const flights = route.flightRoutes.map((fr) => fr.flight);
      const totalPrice = flights.reduce((sum, flight) => sum + flight.price, 0) * parsedQuery.passengers;

      const firstDeparture = flights[0].fromDatetime;
      const lastArrival = flights[flights.length - 1].toDatetime;
      const totalDurationMs = lastArrival.getTime() - firstDeparture.getTime();
      const totalHours = Math.floor(totalDurationMs / (1000 * 60 * 60));
      const totalMinutes = Math.floor((totalDurationMs % (1000 * 60 * 60)) / (1000 * 60));

      const layovers = flights.slice(0, -1).map((flight, i) => {
        const layoverMs = flights[i+1].fromDatetime.getTime() - flight.toDatetime.getTime();
        const hours = Math.floor(layoverMs / (1000 * 60 * 60));
        const minutes = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
        return {
          durationString: `${hours}ч. ${minutes}мин.`,
          airport: flight.toAirport.city,
        };
      });

      return {
        id: route.id,
        hash: route.hash,
        totalPrice: Math.round(totalPrice),
        durationString: `${totalHours}ч. ${totalMinutes}мин.`,
        stops: route.flightRoutes.length - 1,
        layovers,
        airlines: Array.from(new Set(flights.map(f => f.company))),
        flights: flights.map((flight) => ({
          id: flight.id,
          from: flight.fromAirport.city,
          to: flight.toAirport.city,
          departure: flight.fromDatetime,
          arrival: flight.toDatetime,
          company: flight.company,
          flightNumber: flight.flightNumber,
          ticketClass: flight.ticketClass,
          price: flight.price,
        })),
      };
    });

    return res.status(200).json({
      data: result,
      hasMore: endIndex < sortedRoutes.length,
      total: sortedRoutes.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    console.error("Error fetching routes:", error);
    return res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: error }),
    });
  }
}
