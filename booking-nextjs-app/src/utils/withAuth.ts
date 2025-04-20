import { NextApiHandler } from "next";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const session: Session | null = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!session?.user?.id || !session?.user?.email) {
      return res.status(401).json({ message: "Invalid session structure" });
    }

    (req as any).session = session;

    return handler(req, res);
  };
}
