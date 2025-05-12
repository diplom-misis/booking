import { NextApiRequest, NextApiResponse } from "next";
import add from "./_add";
import remove from "./_remove";
import get from "./_get";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    return add(req, res);
  } else if (req.method === "DELETE") {
    return remove(req, res);
  } else if (req.method === "GET") {
    return get(req, res);
  } else {
    return res.status(405).json({
      success: false,
      message: "Метод не поддерживается",
    });
  }
}
