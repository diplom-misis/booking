import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/utils/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/auth/signin" },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "ivanov@yandex.ru",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        console.log(credentials)
        const { email, password } = credentials || {};

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);