import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { Cart } from "@prisma/client";

type Data = {
  message?: string;
  cart?: Cart | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    switch (req.method) {
      case "GET":
        return res.status(200).json({ cart: await prisma.cart.findFirst() });
      case "POST": {
        // await prisma.flight.create({ data: {}})
        await prisma.flightsRoutes.create({ data: { sequenceId: 1, flightId: '1', routeId: '1'}})
        await prisma.route.create({ data: {}})
        console.log(await prisma.route.findMany())
        const cart: Cart = await prisma.cart.create({ data: { routeId: req.body.routeId } });
        return res.status(201).json({ message: 'Cart created', cart });
      }
    }
  } catch (e) {
    console.log("error - ", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
