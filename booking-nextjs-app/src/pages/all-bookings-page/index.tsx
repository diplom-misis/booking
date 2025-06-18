import { Reservation } from "@prisma/client";
import ReservationCard from "@/components/ReservationCard";
import { useReservations } from "@/hooks/useReservations";
import Layout from "../layout";
import { withAuthPage } from "@/utils/withAuthPage";

export default function handler() {
  const { data: reservations } = useReservations();

  return (
    <Layout>
      <div className="flex flex-col justify-self-center gap-6">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800">
          Ваши бронирования
        </h2>
        <div className="flex flex-col gap-3 md:gap-5">
          {reservations &&
            JSON.parse(JSON.stringify(reservations)).reservations?.map(
              (reservation: Reservation, index: number) => (
                <ReservationCard
                  reservationData={JSON.parse(JSON.stringify(reservation))}
                  key={index}
                />
              ),
            )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage();
