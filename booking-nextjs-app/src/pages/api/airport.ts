import type { NextApiRequest, NextApiResponse } from "next";
import { Airport } from "@prisma/client";
import prisma from "@/utils/prisma";
import { z } from "zod";

const AirportCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .length(3, "Airport code must be exactly 3 characters")
    .transform((s) => s.toUpperCase()),
  cityId: z.string().min(1, "City ID is required"),
});

const AirportQuerySchema = z.object({
  cityId: z.string().optional(),
});

interface GetAirportsRequest extends NextApiRequest {
  query: {
    cityId?: string;
  };
}

interface CreateAirportRequest extends NextApiRequest {
  body: z.infer<typeof AirportCreateSchema>;
}

interface AirportsResponse {
  airports: Airport[];
}

interface AirportResponse {
  message: string;
  airport: Airport;
}

interface ErrorResponse {
  message: string;
  errors?: z.ZodIssue[];
}

type ApiResponse = AirportsResponse | AirportResponse | ErrorResponse;

export default async function handler(
  req: GetAirportsRequest | CreateAirportRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    if (req.method === "GET") {
      const validatedQuery = AirportQuerySchema.safeParse(req.query);

      if (!validatedQuery.success) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: validatedQuery.error.errors,
        });
      }

      const { cityId } = validatedQuery.data;

      if (cityId) {
        const airports = await prisma.airport.findMany({
          where: { cityId },
        });
        return res.status(200).json({ airports });
      }

      const airports = await prisma.airport.findMany();
      return res.status(200).json({ airports });
    } else if (req.method === "POST") {
      const validationResult = AirportCreateSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const { name, code, cityId } = validationResult.data;

      const cityExists = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!cityExists) {
        return res.status(400).json({
          message: "Specified city does not exist",
        });
      }

      const existingAirport = await prisma.airport.findFirst({
        where: { code },
      });

      if (existingAirport) {
        return res.status(409).json({
          message: "Airport with this name already exists",
        });
      }

      const airport = await prisma.airport.create({
        data: {
          name,
          code,
          cityId,
        },
      });

      return res.status(201).json({
        message: "Airport created successfully",
        airport,
      });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
