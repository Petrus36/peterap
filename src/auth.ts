import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/prihlasenie",
    signOut: "/auth/odhlasenie",
    newUser: "/auth/registracia",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export const { auth } = handler;
export const { GET, POST } = handler; 