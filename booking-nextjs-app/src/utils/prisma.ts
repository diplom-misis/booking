import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let prisma;

console.log(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN) {
  const libsql = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);

  prisma = new PrismaClient({ adapter });
} else {
  // sqlite для локальной разработки
  prisma = new PrismaClient();
}

export default prisma;
