import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Cart } from '@prisma/client';
import { fetchCart } from '@/services/cartService';

type Data = {
  message?: string;
  cart?: Cart | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case 'GET':
        // console.log((await fetchCart())!.routeId)
        return res.status(200).json({cart: await prisma.cart.findFirst()});
      case 'POST': {
        // const routeId = req.body.routeId;
        // console.log(routeId)
        await prisma.cart.create({ data: { routeId: '1' } });
      }
    }
  } catch (e) {
    console.log('error - ', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
