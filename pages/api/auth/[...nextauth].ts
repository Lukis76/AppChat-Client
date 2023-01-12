import NextAuth, { Session, User } from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@lib/prismadb'
import { JWT } from 'next-auth/jwt'
import { ServerSession } from 'mongodb'
import { AdapterUser } from 'next-auth/adapters'

// export interface session {
//   user?: {
//     id?: string
//     name?: string
//     email?: string
//     image?: string
//     username?: string
//     profilename?: string
//   }
//   expires: string
// }

interface client {
  clientId: string
  clientSecret: string
}
export const authOptions: NextAuthOptions = {
  // your configs

  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as client),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
  },
  callbacks: {
    // @ts-ignore
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      const usuario = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      })
      if (usuario) {
        return {
          ...session,
          user: { ...usuario },
        }
      } else {
        session.user.id = token.sub
        return session
      }
    },
  },
}

export default NextAuth(authOptions)
