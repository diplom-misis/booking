import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { signUpSchema } from "@/schemas/signup";

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
): Promise<void> {
  const parsed = signUpSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message || "Ошибка валидации";
    res.status(400).json({ error: message });
    return;
  }

  const { firstName, lastName, email, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    res.status(409).json({ error: "Пользователь уже существует" });
    return;
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}
