<<<<<<< HEAD
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import bcrypt from 'bcrypt';

interface RegisterRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}
=======
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { signUpSchema } from "@/schemas/signup";
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  id: string;
  email: string;
<<<<<<< HEAD
}

export default async function handler(
  req: RegisterRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // if (await prisma.user.)

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(400).json({ error: 'User already exists.' });
=======
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
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  }
}
