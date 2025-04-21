import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export function withErrorHandler(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("API error:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
