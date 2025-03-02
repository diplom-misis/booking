// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Status } from '@prisma/client';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Пример просмотра и создания. TODO удалить, после обкатки ORM.
  if (req.query.method === 'get') {
    res.status(200).json({ reservation: await prisma.reservation.findMany() })
    return
  }

  const newReservation = await prisma.reservation.create({
    data: {
      data: {
        user: 'John Doe',
        flights: ['FL123', 'FL456'],
        totalPrice: 200.5,
      },
      status: Status.IN_PROCESSING,
    },
  });

  console.log('Reservation Created:', newReservation);
  res.status(200).json({ message: 'Reservation created', reservation: newReservation });
}
