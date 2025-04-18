import { withAuth } from "@/utils/withAuth";

export default withAuth(async (req, res) => {
  const session = (req as any).session;
  res.status(200).json({ message: "Привет", user: session.user });
});
