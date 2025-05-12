import prisma from "@/utils/prisma";
import { Reservation, Status } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  reservation?: Reservation;
  reservations?: Reservation[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method) {
    case "GET":
      return res.json({ reservations: await prisma.reservation.findMany() });
  }
}
