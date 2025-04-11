import prisma from "@/utils/prisma";
import { Reservation } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  reservation?: Reservation;
  reservations?: Reservation[];
};

export default async function saveReservation(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method) {
    case "GET":
      return res.json({ reservations: await prisma.reservation.findMany() });
    case "POST": {
      await prisma.reservation.create({
        data: {
          data: {
            fromCity: req.query.fromCity,
            fromAirport: req.query.fromAirport,
            toCity: req.query.toCity,
            toAirport: req.query.toAirport,
            company: req.query.company,
            fromDatetime: req.query.fromDatetime,
            toDatetime: req.query.toDatetime,
          },
        },
      });

      return res.status(201).json({ message: "reservation created" });
    }
    case "DELETE":
      await prisma.reservation.delete({ where: { id: (await prisma.reservation.findFirst())!.id } });
      return res.status(200).json({ message: "Reservation deleted" });
  }
}
