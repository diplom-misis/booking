import { profileSchema } from "@/schemas/profile";
import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { withErrorHandler } from "@/utils/withErrorHandler";

const DEFAULT_AVATAR = "";

export const PROFILE_DEFAULT_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  defaultCountry: true,
  imageUrl: true,
};

const handler = withAuth(async (req, res) => {
  const session = (req as any).session;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: PROFILE_DEFAULT_SELECT,
    });

    if (user) {
      user.imageUrl = user.imageUrl || DEFAULT_AVATAR;
      return res.status(200).json({ user });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
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
      select: PROFILE_DEFAULT_SELECT,
    });

    updatedUser.imageUrl = updatedUser.imageUrl || DEFAULT_AVATAR;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
});

export default withErrorHandler(handler);
