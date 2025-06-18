import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { Cart } from "@prisma/client";

const get = withAuth(async (req, res) => {
  const session = (req as any).session;

  const userId = session.user.id;

  try {
    const carts: Cart[] = await prisma.cart.findMany({
      where: { userId },
    });

    console.log(carts)

    return res.status(200).json({ carts });
  } catch (e) {
    console.log(`error - ${e}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default withErrorHandler(get);
