import type { NextApiRequest, NextApiResponse } from "next";
import { City } from "@prisma/client";
import prisma from "@/utils/prisma";
import { z } from "zod";

const CityCreateSchema = z.object({
  name: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Zа-яА-Я\s\-']+$/,
      "City name can only contain letters, spaces, hyphens and apostrophes",
    ),
});

const CityQuerySchema = z.object({
  search: z.string().optional(),
});

interface GetCitiesRequest extends NextApiRequest {
  query: z.infer<typeof CityQuerySchema>;
}

interface CreateCityRequest extends NextApiRequest {
  body: z.infer<typeof CityCreateSchema>;
}

interface GetCitiesResponse {
  cities: City[];
}

interface CreateCityResponse {
  message: string;
  city: City;
}

interface ErrorResponse {
  message: string;
  errors?: z.ZodIssue[];
}

type ApiResponse = GetCitiesResponse | CreateCityResponse | ErrorResponse;

export default async function handler(
  req: GetCitiesRequest | CreateCityRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    if (req.method === "GET") {
      const validatedQuery = CityQuerySchema.safeParse(req.query);

      if (!validatedQuery.success) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: validatedQuery.error.errors,
        });
      }

      const { search } = validatedQuery.data;

      const cities: City[] = await prisma.city.findMany({
        where: search
        ? {
            OR: [
              { name: { contains: search } },
              { name: { contains: search.toLowerCase() } },
              { name: { contains: search.toUpperCase() } },
              { name: { contains: search[0].toUpperCase() + search.slice(1).toLowerCase() } },
            ],
          }
        : {},
      });

      return res.status(200).json({ cities });
    } else if (req.method === "POST") {
      const validationResult = CityCreateSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }

      const { name } = validationResult.data;

      const existingCity = await prisma.city.findFirst({
        where: {
          name: {
            equals: name,
          },
        },
      });

      if (existingCity) {
        return res.status(409).json({
          message: "City with this name already exists",
        });
      }

      const newCity = await prisma.city.create({
        data: { name },
      });

      return res.status(201).json({
        message: "City created successfully",
        city: newCity,
      });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
