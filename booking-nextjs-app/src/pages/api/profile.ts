import { profileSchema } from "@/schemas/profile";
import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { withErrorHandler } from "@/utils/withErrorHandler";

const handler = withAuth(async (req, res) => {
  const session = (req as any).session;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    return res.status(200).json({ user });
  } else if (req.method === "PATCH") {
    const validationResult = profileSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: validationResult.error.flatten(),
      });
    }

    if (validationResult.data.country) {
      // TODO
      // await prisma.country.findUnique
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validationResult.data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        // country: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: {email: updatedUser.email, firstName: updatedUser.firstName, lastName: updatedUser.lastName, country: ''} });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
});

export default withErrorHandler(handler);
