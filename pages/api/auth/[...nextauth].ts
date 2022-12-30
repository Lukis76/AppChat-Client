import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@lib/prismadb"


interface client {
  clientId: string,
  clientSecret: string
}
export const authOptions: NextAuthOptions = {
  // your configs

  adapter: PrismaAdapter(prisma),

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  } as client)
]

}

export default NextAuth(authOptions);
