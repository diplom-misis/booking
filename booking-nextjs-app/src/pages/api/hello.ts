// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { City, Reservation, Status } from '@prisma/client';

type Data = {
  message?: string;
  reservation?: Reservation;
  reservations?: Reservation[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.query.method === 'test') {
    const name = Array.isArray(req.query.name) ? req.query.name[0] : req.query.name || '';
    const city: City = await prisma.city.create({
      data: { name },
    });
    console.log('Reservation Created:', city)
    res.status(200)
    return
  }
  // Пример просмотра и создания. TODO удалить, после обкатки ORM.
  if (req.query.method === 'get') {
    console.log("test")
    res.status(200).json({ reservations: await prisma.reservation.findMany() });
    return;
  }

  const newReservation = await prisma.reservation.create({
    data: {
      data: {
        user: 'John Doe',
        flights: ['FL123', 'FL456'],
        totalPrice: 200.5,
      },
      status: Status.IN_PROCESSING,
      userId: "1"
    },
  });

  console.log('Reservation Created:', newReservation);
  res
    .status(200)
    .json({ message: 'Reservation created', reservation: newReservation });
}
