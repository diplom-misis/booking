import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/utils/prisma';

export default NextAuth({
<<<<<<< HEAD
  // pages: { signIn: '/auth/signin' },
=======
  pages: { signIn: '/auth/signin' },
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'ivanov@yandex.ru' },
        password: {  label: 'Password', type: 'password', placeholder: '******' }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials || {};

        const user = await prisma.user.findUnique({
          where: { email: username },
        });
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null or false then the credentials will be rejected
          return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      }
    })
  ],
})
