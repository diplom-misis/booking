import { format } from "date-fns";
import prisma from "@/utils/prisma";

/**
 * Создает партицию для указанного месяца и переносит в нее данные из дефолтной партиции
 * @param month Дата, определяющая месяц для создания партиции
 */
export async function createPartitionAndMigrate(month: Date) {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const nextMonthStart = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const fromDate = format(monthStart, "yyyy-MM-dd");
  const toDate = format(nextMonthStart, "yyyy-MM-dd");
  const partitionName = `Flight_${format(monthStart, "yyyy_MM")}`;

  try {
    await prisma.$transaction(async (tx) => {
      const partitionExists = await tx.$queryRaw<{ exists: boolean }[]>`
        SELECT EXISTS (
          SELECT 1 FROM pg_tables 
          WHERE schemaname = 'public' 
          AND tablename = ${partitionName}
        ) as "exists"
      `;

      if (!partitionExists[0].exists) {
        await tx.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "${partitionName}" PARTITION OF "Flight"
          FOR VALUES FROM ('${fromDate}') TO ('${toDate}')
        `);
        console.log(`[Partition] Created partition ${partitionName}`);
      }

      await tx.$executeRaw`LOCK TABLE "Flight_default" IN SHARE MODE`;

      let movedTotal = 0;
      let hasMore = true;
      const BATCH_SIZE = 1000;

      while (hasMore) {
        const rowsToMove = await tx.$queryRawUnsafe<{ id: string }[]>(`
          SELECT id FROM "Flight_default"
          WHERE "fromDatetime" >= '${fromDate}'
            AND "fromDatetime" < '${toDate}'
          LIMIT ${BATCH_SIZE}
        `);

        if (rowsToMove.length > 0) {
          const movedCount = await tx.$executeRawUnsafe(`
            WITH moved_rows AS (
              DELETE FROM "Flight_default"
              WHERE id IN (${rowsToMove.map((r) => `'${r.id}'`).join(",")})
              RETURNING *
            )
            INSERT INTO "${partitionName}"
            SELECT * FROM moved_rows
          `);

          movedTotal += rowsToMove.length;
          console.log(
            `[Partition] Moved batch of ${rowsToMove.length} records`,
          );
        }

        hasMore = rowsToMove.length === BATCH_SIZE;
      }

      if (movedTotal > 0) {
        const remaining = await tx.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*) FROM "Flight_default"
          WHERE "fromDatetime" >= '${fromDate}'
            AND "fromDatetime" < '${toDate}'
        `;

        if (remaining[0].count > 0) {
          throw new Error(`Failed to move all records to ${partitionName}`);
        }

        console.log(
          `[Partition] Successfully moved ${movedTotal} records to ${partitionName}`,
        );
      } else {
        console.log(`[Partition] No records to move for ${partitionName}`);
      }
    });
  } catch (error) {
    console.error(
      `[Partition] Error processing partition ${partitionName}:`,
      error,
    );
    throw error;
  }
}
