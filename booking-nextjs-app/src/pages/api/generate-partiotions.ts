import { addMonths } from "date-fns";
import { createPartitionAndMigrate } from "@/utils/partitionGenerator";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const targetMonth = addMonths(new Date(), 12);
    await createPartitionAndMigrate(targetMonth);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[PARTITION_GENERATION_ERROR]", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
