import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import bcrypt from 'bcrypt';

interface RegisterRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  id: string;
  email: string;
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
  }
}
