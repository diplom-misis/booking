import { PrismaClient } from "@prisma/client";

<<<<<<< HEAD
// const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
// const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

// console.log(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
// if (!TURSO_DATABASE_URL) {
//   throw new Error("TURSO_DATABASE_URL is not defined in environment variables.");
// }
// if (!TURSO_AUTH_TOKEN) {
//   throw new Error("TURSO_AUTH_TOKEN is not defined in environment variables.");
// }

// const libsql = createClient({
//   url: TURSO_DATABASE_URL,
//   authToken: TURSO_AUTH_TOKEN,
// });

// const adapter = new PrismaLibSQL(libsql);

const prisma = new PrismaClient();

=======
const prisma = new PrismaClient({
  // log: ["query"],
});

>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
export default prisma;
