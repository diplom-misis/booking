import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { z } from "zod";

const CountryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Country name must be at least 2 characters")
    .max(50, "Country name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Zа-яА-Я\s\-']+$/,
      "Country name can only contain letters, spaces, hyphens and apostrophes",
    ),
});

const CountryQuerySchema = z.object({
  search: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const validatedQuery = CountryQuerySchema.safeParse(req.query);

      if (!validatedQuery.success) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: validatedQuery.error.errors,
        });
      }

      const { search } = validatedQuery.data;

      const countries = await prisma.country.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search } },
                { name: { contains: search.toLowerCase() } },
                { name: { contains: search.toUpperCase() } },
              ],
            }
          : {},
        include: {
          cities: true,
        },
      });

      return res.status(200).json({ countries });
    }

    if (req.method === "POST") {
      const validation = CountryCreateSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validation.error.errors,
        });
      }

      const { name } = validation.data;

      const existing = await prisma.country.findUnique({ where: { name } });

      if (existing) {
        return res.status(409).json({ message: "Country already exists" });
      }

      const country = await prisma.country.create({
        data: { name },
        include: { cities: true },
      });

      return res.status(201).json({ message: "Country created", country });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
