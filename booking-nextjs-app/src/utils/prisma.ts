import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

console.log(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
if (!TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not defined in environment variables.");
}
if (!TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not defined in environment variables.");
}

const libsql = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);

const prisma = new PrismaClient({ adapter });

export default prisma;
