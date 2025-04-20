import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/utils/prisma";

const schema = z.object({
  routeId: z.string().uuid(),
  passengersCount: z.number().int().min(1).max(10),
});

export default async function add(req: NextApiRequest, res: NextApiResponse) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: result.error.flatten(),
    });
  }

  const { routeId, passengersCount } = result.data;

  try {
    const routeExists = await prisma.route.findUnique({
      where: { id: routeId },
    });
    if (!routeExists) {
      return res.status(404).json({ error: "Route not found" });
    }

    const createOperations = Array(passengersCount)
      .fill(null)
      .map(() =>
        prisma.cart.create({
          data: { routeId },
          include: { route: true },
        }),
      );

    const carts = await Promise.all(createOperations);

    res.status(201).json({
      success: true,
      count: carts.length,
      items: carts,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
