import { dropOldPartitions } from "@/utils/partitionGenerator";
import type { NextApiRequest, NextApiResponse } from "next";

const MONTHS_TO_KEEP = 12;

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
    await dropOldPartitions(MONTHS_TO_KEEP);
    return res.status(200).json({ success: true, monthsKept: MONTHS_TO_KEEP });
  } catch (error) {
    console.error("[DROP_OLD_PARTITIONS_ERROR]", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}