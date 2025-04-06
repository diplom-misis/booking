import type { NextApiRequest, NextApiResponse } from "next";
import { City, Airport } from "@prisma/client";
import prisma from "@/utils/prisma";

interface ApiResponse {
  message?: string;
  cities?: City[];
  airports?: Airport[];
  city?: City;
  airport?: Airport;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    if (req.method === "GET") {
      if (req.query.cityId) {
        // Получение списка аэропортов для конкретного города
        const airports: Airport[] = await prisma.airport.findMany({
          where: { cityId: String(req.query.cityId) },
        });
        return res.status(200).json({ airports });
      }

      // Получение списка всех городов
      const cities: City[] = await prisma.city.findMany();
      return res.status(200).json({ cities });
    }

    if (req.method === "POST") {
      const { name, code, cityId, country } = req.body;

      if (req.query.type === "city") {
        // Создание города
        const newCity: City = await prisma.city.create({
          data: { name },
        });
        return res.status(201).json({ message: "City created", city: newCity });
      }

      if (req.query.type === "airport") {
        // Создание аэропорта
        if (!name || !code || !cityId || !country) {
          return res
            .status(400)
            .json({ message: "Missing required fields for airport" });
        }

        const newAirport: Airport = await prisma.airport.create({
          data: { name, code, cityId, country },
        });
        return res
          .status(201)
          .json({ message: "Airport created", airport: newAirport });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
