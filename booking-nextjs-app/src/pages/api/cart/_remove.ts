import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/utils/prisma";

const schema = z.object({
  routeId: z.string().uuid("Некорректный ID маршрута"),
});

export default async function remove(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Ошибка валидации",
      errors: result.error.flatten(),
    });
  }

  const { routeId } = result.data;

  try {
    const deleteResult = await prisma.cart.deleteMany({
      where: { routeId },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Маршрут не найден в корзине",
      });
    }

    return res.status(200).json({
      success: true,
      deletedCount: deleteResult.count,
      message: `Удалено ${deleteResult.count} элементов`,
    });
  } catch (error) {
    console.error("Ошибка при удалении из корзины:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера",
    });
  }
}
