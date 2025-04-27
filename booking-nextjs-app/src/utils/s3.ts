import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: "https://storage.yandexcloud.net",
  region: "ru-central1",
  credentials: {
    accessKeyId: process.env.YC_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.YC_S3_SECRET_KEY as string,
  },
});
