import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { Reservation, Status } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  reservation?: Reservation;
  reservations?: Reservation[];
};

const handler = withAuth(
  async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const session = (req as any).session;

    const userId = session.user.id;

    switch (req.method) {
      case "GET":
        return res.json({
          reservations: await prisma.reservation.findMany({
            where: { userId },
            orderBy: {
              createdAt: "desc",
            },
          }),
        });
      case "POST":
        const newReservation: Reservation = await prisma.reservation.create({
          data: {
            data: {
              id: req.query.id,
              fromCity: req.query.fromCity,
              toCity: req.query.toCity,
              company: req.query.company,
              timeFrom: req.query.timeFrom,
              dateFrom: req.query.dateFrom,
              bookingDate: req.query.bookingDate,
              price: req.query.price,
            },
            userId,
            status: Status.IN_PROCESSING,
          },
        });

        return res.status(201).json({
          message: "reservation created",
          reservation: newReservation,
        });
      case "DELETE":
        const reservationToDelete: Reservation =
          await prisma.reservation.delete({
            where: { id: JSON.parse(req.body).id },
          });
        return res.status(200).json({
          message: "Reservation deleted",
          reservation: reservationToDelete,
        });
      case "PATCH":
        const reservationToUpdate: Reservation =
          await prisma.reservation.update({
            where: { id: JSON.parse(req.body).id },
            data: JSON.parse(req.body).data,
          });
        return res.status(200).json({
          message: "Reservation updated",
          reservation: reservationToUpdate,
        });
    }
  },
);

export default withErrorHandler(handler);
