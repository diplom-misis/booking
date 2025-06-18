import { Reservation } from '@prisma/client'

export const fetchReservations = async () => {
  try {
    const reservations: Reservation[] = await fetch('/api/booking').then((res) => res.json())
    return reservations || [];
  } catch (e) {
    console.log(`error - ${e}`)
    return []
  }
}
