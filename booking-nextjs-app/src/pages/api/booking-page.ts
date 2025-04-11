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
        console.log(await prisma.reservation.findMany())
        return res.status(200).json({ cart: await prisma.cart.findFirst() });
      case "POST": {
        console.log(`req.body - ${JSON.parse(req.body).routeId}`)
        const cart: Cart = await prisma.cart.create({
          data: { routeId: JSON.parse(req.body).routeId },
        });
        return res.status(201).json({ message: "Cart created", cart });
      }
      case "DELETE":
        await prisma.cart.delete({where: { id:(await prisma.cart.findFirst())?.id } })
        res.status(200).json({ message: "Cart deleted" })
    }
  } catch (e) {
    console.log("error - ", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
