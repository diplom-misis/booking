import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';


interface FlightDto {
  departureAirport: string;
  departureDateTime: string;
  arrivalAirport: string;
  arrivalDateTime: string;
  company: string;
  price: number;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const flights = req.body.data;

    if (!Array.isArray(flights)) {
      return res.status(400).json({ message: 'Expected an array of flights' });
    }

    const airportCodes: string[] = req.body.data.flatMap((flight: FlightDto) => [
      flight.departureAirport.toUpperCase(),
      flight.arrivalAirport.toUpperCase(),
    ]);

    const uniqueCodes = [...new Set(airportCodes)];

    const airports = await prisma.airport.findMany({
      where: {
        code: {
          in: uniqueCodes,
        },
      },
    });

    if (!airports.length || airports.length !== uniqueCodes.length) {
      return res.status(400).json({ message: 'Unexpected airport codes.' })
    }

    const airports_map: { [code: string]: string; } = {};
    airports.forEach((airport) => {
      airports_map[airport.code] = airport.id;
    });

    const formattedFlights = flights.map((flight) => {
      const {
        departureAirport,
        departureDateTime,
        arrivalAirport,
        arrivalDateTime,
        company,
        price,
      } = flight;

      if (
        !departureAirport ||
        !departureDateTime ||
        !arrivalAirport ||
        !arrivalDateTime ||
        !company ||
        price == null
      ) {
        throw new Error('Missing required flight fields');
      }

      return {
        fromAirportId: airports_map[departureAirport.toUpperCase()],
        fromDatetime: new Date(departureDateTime),
        toAirportId: airports_map[arrivalAirport.toUpperCase()],
        toDatetime: new Date(arrivalDateTime),
        company,
        price: Number(price),
      };
    });

    const createdFlights = await prisma.flight.createMany({
      data: formattedFlights,
    });

    res
      .status(201)
      .json({ message: 'Flights created', count: createdFlights.count });
  } catch (error) {
    console.error('[FLIGHT_CREATE_ERROR]', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
