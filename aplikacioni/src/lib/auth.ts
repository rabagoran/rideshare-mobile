import "server-only";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "rideshare-mobile.next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false },
    },
    callbackUrl: {
      name: "rideshare-mobile.next-auth.callback-url",
      options: { sameSite: "lax", path: "/", secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false },
    },
    csrfToken: {
      name: "rideshare-mobile.next-auth.csrf-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false },
    },
  },
  providers: [GitHubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
  })],
  session: { strategy: "jwt", maxAge: 2 * 60 * 60 },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}
