import { DateTime } from "luxon";
import prisma from "@/utils/prisma";
import { Flight } from "@prisma/client";

const MAX_TRANSFERS = 3;
const MAX_WAIT_HOURS = 24;
const MIN_WAIT_HOURS = 1;

interface FlightNode {
  id: string;
  fromAirportId: string;
  toAirportId: string;
  fromDatetime: Date;
  toDatetime: Date;
  company: string;
  price: number;
}

/*
  Генерирует маршруты на неделю вперёд, начиная с указанной или текущей даты.
  
  Если нужно покрыть больший период, запускайте функцию несколько раз,
  сдвигая каждый следующий fromDt на 6 дней вперёд от предыдущего запуска.
  Так маршруты будут формироваться быстрее, и ни один из них не потеряется.
*/
export async function generateRoutes(fromDateTime: DateTime | null = null) {
  const fromDt = fromDateTime || DateTime.utc();
  const oneWeekAhead = fromDt.plus({ weeks: 1 });

  const flights = await prisma.flight.findMany({
    where: {
      fromDatetime: {
        gte: fromDt.toJSDate(),
        lt: oneWeekAhead.toJSDate(),
      },
    },
  });

  const flightMap: Map<string, FlightNode[]> = new Map();
  flights.forEach((flight) => {
    if (!flightMap.has(flight.fromAirportId)) {
      flightMap.set(flight.fromAirportId, []);
    }
    flightMap.get(flight.fromAirportId)?.push(flight);
  });

  const allRoutes: string[][] = [];
  const seenHashes = new Set();

  let flightCount = 0;

  for (const flight of flights) {
    flightCount += 1;
    if (flightCount % 100 === 0) {
      console.log("flightCount:", flightCount);
    }

    await dfs(
      [flight],
      new Set([flight.fromAirportId, flight.toAirportId]),
      flightMap,
      allRoutes,
      seenHashes,
    );
  }

  const batchSize = 10000;
  for (let i = 0; i < allRoutes.length; i += batchSize) {
    console.log(`Начинаем обработку с ${i} по ${i + batchSize}`);
    await saveRoutes(allRoutes.slice(i, i + batchSize), flights);
    console.log(`Закончили обработку с ${i} по ${i + batchSize}`);
  }
}

async function saveRoutes(routes: string[][], flights: Flight[]) {
  await prisma.$transaction(async (tx) => {
    console.log("Начинаем создание Route's.");
    console.log("Количество маршуртов:", routes.length);

    const existingHashes = (
      await tx.route.findMany({
        where: { hash: { in: routes.map((path) => path.join("-")) } },
        select: { hash: true },
      })
    ).map((r) => r.hash);

    const validRoutes = routes.filter(
      (path) => !existingHashes.includes(path.join("-")),
    );

    await tx.route.createMany({
      data: validRoutes.map((path) => ({
        hash: path.join("-"),
      })),
    });

    console.log("Закончили создание Route's.");

    const createdRoutes = await tx.route.findMany({
      where: {
        hash: { in: validRoutes.map((path) => path.join("-")) },
      },
      select: { id: true, hash: true },
    });

    const hashToId = new Map(
      createdRoutes.map((route) => [route.hash, route.id]),
    );

    console.log("Начинаем создание FlightsRoutes.");

    const flightIdToDate = new Map(flights.map((f) => [f.id, f.fromDatetime]));

    const flightsRoutesData = validRoutes.flatMap((path) => {
      const hash = path.join("-");
      const routeId = hashToId.get(hash)!;
      return path.map((flightId, i) => ({
        sequenceId: i,
        routeId,
        flightId,
        flightDate: flightIdToDate.get(flightId)!,
      }));
    });

    console.log("Записываем FlightsRoutes.");

    await tx.flightsRoutes.createMany({
      data: flightsRoutesData,
    });

    console.log("Закончили создание FlightsRoutes.");
  });
}

async function dfs(
  path: FlightNode[],
  visitedAirports: Set<string>,
  flightMap: Map<string, FlightNode[]>,
  allRoutes: string[][],
  seenHashes: Set<string | unknown>,
) {
  const hash = path.map((f) => f.id).join("-");

  if (seenHashes.has(hash)) return;
  seenHashes.add(hash);
  allRoutes.push(path.map((f) => f.id));

  if (path.length >= MAX_TRANSFERS) return;

  const lastFlight = path[path.length - 1];

  const arrival = DateTime.fromJSDate(lastFlight.toDatetime);
  const nextFlights = flightMap.get(lastFlight.toAirportId) || [];

  for (const nextFlight of nextFlights) {
    const departure = DateTime.fromJSDate(nextFlight.fromDatetime);
    const waitHours = departure.diff(arrival, "hours").hours;

    if (
      waitHours >= MIN_WAIT_HOURS &&
      waitHours <= MAX_WAIT_HOURS &&
      !visitedAirports.has(nextFlight.toAirportId)
    ) {
      const newPath = [...path, nextFlight];
      const newVisited = new Set(visitedAirports);
      newVisited.add(nextFlight.toAirportId);
      await dfs(newPath, newVisited, flightMap, allRoutes, seenHashes);
    }
  }
}
