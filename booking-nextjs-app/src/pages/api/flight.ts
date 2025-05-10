import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { TicketClass } from "@prisma/client";
import { z } from "zod";

const FlightSchema = z.object({
  departureAirport: z
    .string()
    .min(3)
    .max(3)
    .transform((s) => s.toUpperCase()),
  departureDateTime: z.string().datetime(), // UTC
  arrivalAirport: z
    .string()
    .min(3)
    .max(3)
    .transform((s) => s.toUpperCase()),
  arrivalDateTime: z.string().datetime(), // UTC
  company: z.string().min(1),
  flightNumber: z.string().min(1),
  ticketClass: z.nativeEnum(TicketClass),
  price: z.number().positive(),
});

const FlightCreateRequestSchema = z.object({
  data: z.array(FlightSchema),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const validationResult = FlightCreateRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: validationResult.error.flatten(),
      });
    }

    const { data: flights } = validationResult.data;

    const airportCodes = [
      ...new Set(
        flights.flatMap((flight) => [
          flight.departureAirport,
          flight.arrivalAirport,
        ]),
      ),
    ];

    const airports = await prisma.airport.findMany({
      where: { code: { in: airportCodes } },
    });

    if (airports.length !== airportCodes.length) {
      const airportsSet = new Set(airports.map((airport) => airport.code));
      const missingCodes = airportCodes.filter(
        (code) => !airportsSet.has(code),
      );
      return res.status(400).json({
        message: "Unknown airport codes",
        missingCodes,
      });
    }

    const airportMap = Object.fromEntries(
      airports.map((airport) => [airport.code, airport.id]),
    );

    const flightsToCreate = flights.map((flight) => ({
      fromAirportId: airportMap[flight.departureAirport],
      fromDatetime: new Date(flight.departureDateTime),
      toAirportId: airportMap[flight.arrivalAirport],
      toDatetime: new Date(flight.arrivalDateTime),
      company: flight.company,
      flightNumber: flight.flightNumber,
      ticketClass: flight.ticketClass,
      price: flight.price,
    }));

    const getFlightKey = (flight: {
      fromAirportId: string;
      toAirportId: string;
      fromDatetime: Date;
      toDatetime: Date;
      company: string;
      flightNumber: string;
      ticketClass: TicketClass;
    }) => {
      return [
        flight.fromAirportId,
        flight.toAirportId,
        flight.fromDatetime.getTime(),
        flight.toDatetime.getTime(),
        flight.company,
        flight.flightNumber,
        flight.ticketClass,
      ].join("|");
    };

    const existingFlights = await prisma.flight.findMany({
      where: {
        OR: flightsToCreate.map((flight) => ({
          fromAirportId: flight.fromAirportId,
          toAirportId: flight.toAirportId,
          fromDatetime: flight.fromDatetime,
          toDatetime: flight.toDatetime,
          company: flight.company,
          flightNumber: flight.flightNumber,
          ticketClass: flight.ticketClass,
        })),
      },
      select: {
        fromAirportId: true,
        toAirportId: true,
        fromDatetime: true,
        toDatetime: true,
        company: true,
        flightNumber: true,
        ticketClass: true,
      },
    });

    const existingFlightsSet = new Set(
      existingFlights.map((flight) => getFlightKey(flight)),
    );

    const uniqueFlightsToCreate = flightsToCreate.filter(
      (flight) => !existingFlightsSet.has(getFlightKey(flight)),
    );

    let createdCount = 0;
    if (uniqueFlightsToCreate.length > 0) {
      const createdFlights = await prisma.flight.createMany({
        data: uniqueFlightsToCreate,
      });
      createdCount = createdFlights.count;
    }

    const duplicateCount =
      flightsToCreate.length - uniqueFlightsToCreate.length;
    const message =
      duplicateCount > 0
        ? `Flights created successfully. ${duplicateCount} duplicate flights were ignored.`
        : "Flights created successfully";

    res.status(201).json({
      message,
      count: createdCount,
      duplicatesIgnored: duplicateCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
