import { format, subMonths } from "date-fns";
import { Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";

const BATCH_SIZE = 1000;

const PARTITIONED_TABLES = [
  { parent: "Flight", defaultPartition: "Flight_default", dateColumn: "fromDatetime" },
  { parent: "FlightsRoutes", defaultPartition: "FlightsRoutes_default", dateColumn: "flightDate" },
] as const;

/**
 * Создаёт партицию для указанного месяца на каждой партиционированной таблице
 * (Flight и FlightsRoutes) и переносит в неё данные из дефолтной партиции.
 * Идемпотентна: повторный запуск для уже существующих партиций безопасен.
 */
export async function createPartitionAndMigrate(month: Date) {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const nextMonthStart = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const fromDate = format(monthStart, "yyyy-MM-dd");
  const toDate = format(nextMonthStart, "yyyy-MM-dd");
  const monthKey = format(monthStart, "yyyy_MM");

  try {
    await prisma.$transaction(async (tx) => {
      for (const { parent, defaultPartition, dateColumn } of PARTITIONED_TABLES) {
        const partitionName = `${parent}_${monthKey}`;
        await ensurePartitionAndMigrate(
          tx,
          parent,
          defaultPartition,
          dateColumn,
          partitionName,
          fromDate,
          toDate,
        );
      }
    });
  } catch (error) {
    console.error(`[Partition] Error processing month ${monthKey}:`, error);
    throw error;
  }
}

/**
 * Удаляет партиции старше N месяцев на каждой партиционированной таблице.
 * Порядок удаления: сначала FlightsRoutes_YYYY_MM (зависимая), затем Flight_YYYY_MM (владелец),
 * затем дочистка orphan-маршрутов из таблицы Route.
 */
export async function dropOldPartitions(monthsToKeep: number) {
  const cutoff = subMonths(new Date(), monthsToKeep);
  const cutoffKey = format(cutoff, "yyyy_MM");

  try {
    await prisma.$transaction(async (tx) => {
      const allPartitions = await tx.$queryRaw<{ tablename: string }[]>`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename ~ '^(Flight|FlightsRoutes)_[0-9]{4}_[0-9]{2}$'
        ORDER BY tablename
      `;

      const oldPartitions = allPartitions.filter((p) => {
        const match = p.tablename.match(/_([0-9]{4}_[0-9]{2})$/);
        return match !== null && match[1] < cutoffKey;
      });

      const oldFR = oldPartitions.filter((p) =>
        p.tablename.startsWith("FlightsRoutes_"),
      );
      const oldF = oldPartitions.filter(
        (p) =>
          p.tablename.startsWith("Flight_") &&
          !p.tablename.startsWith("FlightsRoutes_"),
      );

      for (const p of oldFR) {
        await tx.$executeRawUnsafe(`DROP TABLE "${p.tablename}"`);
        console.log(`[Partition] Dropped ${p.tablename}`);
      }
      for (const p of oldF) {
        await tx.$executeRawUnsafe(`DROP TABLE "${p.tablename}"`);
        console.log(`[Partition] Dropped ${p.tablename}`);
      }

      const orphanCount = await tx.$executeRaw`
        DELETE FROM "Route" WHERE id NOT IN (SELECT DISTINCT "routeId" FROM "FlightsRoutes")
      `;
      console.log(`[Partition] Deleted ${orphanCount} orphan routes`);
    });
  } catch (error) {
    console.error(`[Partition] Error dropping old partitions:`, error);
    throw error;
  }
}

async function ensurePartitionAndMigrate(
  tx: Prisma.TransactionClient,
  parentTable: string,
  defaultPartition: string,
  dateColumn: string,
  partitionName: string,
  fromDate: string,
  toDate: string,
) {
  const exists = await tx.$queryRawUnsafe<{ exists: boolean }[]>(
    `SELECT EXISTS (
       SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1
     ) as "exists"`,
    partitionName,
  );

  if (!exists[0].exists) {
    await tx.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "${partitionName}" PARTITION OF "${parentTable}" FOR VALUES FROM ('${fromDate}') TO ('${toDate}')`,
    );
    console.log(`[Partition] Created ${partitionName}`);
  }

  await tx.$executeRawUnsafe(`LOCK TABLE "${defaultPartition}" IN SHARE MODE`);

  let movedTotal = 0;
  let hasMore = true;

  while (hasMore) {
    const rowsToMove = await tx.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "${defaultPartition}"
       WHERE "${dateColumn}" >= '${fromDate}' AND "${dateColumn}" < '${toDate}'
       LIMIT ${BATCH_SIZE}`,
    );

    if (rowsToMove.length > 0) {
      const idList = rowsToMove.map((r) => `'${r.id}'`).join(",");
      await tx.$executeRawUnsafe(
        `WITH moved_rows AS (
           DELETE FROM "${defaultPartition}"
           WHERE id IN (${idList})
           RETURNING *
         )
         INSERT INTO "${partitionName}" SELECT * FROM moved_rows`,
      );
      movedTotal += rowsToMove.length;
    }

    hasMore = rowsToMove.length === BATCH_SIZE;
  }

  if (movedTotal > 0) {
    console.log(`[Partition] Moved ${movedTotal} rows to ${partitionName}`);
  }
}