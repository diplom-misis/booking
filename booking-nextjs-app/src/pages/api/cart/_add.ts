import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/utils/prisma";
import { withAuth } from '@/utils/withAuth';
import { withErrorHandler } from '@/utils/withErrorHandler';

const schema = z.object({
  routeId: z.string().uuid(),
  passengersCount: z.number().int().min(1).max(10),
});

const add = withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: result.error.flatten(),
    });
  }

  const { routeId, passengersCount } = result.data;

  const session = (req as any).session;

  const userId = session.user.id;

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
          data: { routeId, userId },
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
})

export default withErrorHandler(add);
