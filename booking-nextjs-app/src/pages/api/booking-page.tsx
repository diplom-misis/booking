import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Reservation, Status, User, Cart } from '@prisma/client';

type Data = {
  message?: string;
  reservation?: Reservation| null;
  reservations?: Reservation[];
  users?: User[];
  cart?: Cart | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // console.log('Reservation Created:', newReservation);
  // res
  //   .status(200)
  //   .json({ message: 'Reservation created', reservation: newReservation });

  // await prisma.user.create({ data: { name: 'George', email: 'test@ya.ru' } })
  res.status(200).json({ users: await prisma.user.findMany(), cart: await prisma.cart.findFirst(), reservation: await prisma.reservation.findFirst() });
}
