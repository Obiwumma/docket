import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY
        ? process.env.AUTH_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    }),
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || null;
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      if (!token.role && token.sub) {
        try {
          const db = getFirestore();
          const userDoc = await db.collection("users").doc(token.sub).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            if (data?.role) {
              token.role = data.role;
            }
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || (token.id as string);
        session.user.role = (token.role as string) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };