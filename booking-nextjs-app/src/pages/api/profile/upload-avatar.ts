import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "@/utils/s3";
import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/withAuth";
import { PROFILE_DEFAULT_SELECT } from ".";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "diplom-misis",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const extension = file.originalname.split(".").pop() || "";
      const uniqueFileName = `${uuidv4()}${extension ? `.${extension}` : ""}`;
      cb(null, `avatars/${uniqueFileName}`);
    },
  }),
});

const router = createRouter<NextApiRequest, NextApiResponse>();

const uploadMiddleware = upload.single("avatar");

router.post(
  withAuth(async (req, res) => {
    const session = (req as any).session;

    try {
      await new Promise<void>((resolve, reject) => {
        uploadMiddleware(req as any, res as any, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: "File upload failed" });
      }

      console.log(file.location);

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { imageUrl: file.location },
        select: PROFILE_DEFAULT_SELECT,
      });

      return res.status(200).json({ url: file.location, user: updatedUser });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }),
);

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end("Internal server error");
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
