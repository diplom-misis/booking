import { profileSchema } from "@/schemas/profile";
import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { withErrorHandler } from "@/utils/withErrorHandler";

const handler = withAuth(async (req, res) => {
  const session = (req as any).session;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        defaultCountry: true,
      },
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

    const { firstName, lastName, email, defaultCountry } =
      validationResult.data;

    if (defaultCountry) {
      const countryExists = await prisma.country.findUnique({
        where: { id: defaultCountry.id },
      });

      if (!countryExists) {
        return res.status(400).json({
          message: "Specified country does not exist",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName, email, defaultCountryId: defaultCountry.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        defaultCountry: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
});

export default withErrorHandler(handler);
