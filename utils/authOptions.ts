import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
require("@/models/School");
import User from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import { SchoolDoc, UserDoc } from "@/types/monggModels";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return null;
          }

          await connectDB();

          const user = (await User.findOne({ email: credentials.email })
            .select("name email password schoolRole")
            .populate({ path: "school", select: "name" })) as UserDoc;
          user.school = user.school as SchoolDoc;

          if (!user) {
            return null;
          }

          const isPwMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPwMatch) {
            return null;
          }

          return {
            email: user.email,
            name: user.name,
            id: user._id.toString(),
            schoolRole: user.schoolRole,
            schoolName: user.school.name,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      // console.log("session//", { session, token });

      if (token.id) {
        session.user.id = token.id as string;
        session.user.schoolName = token.schoolName as string;
        session.user.schoolRole = token.schoolRole as string;
      }
      // console.log("session-modified//", session);

      // const { session } = args;
      // if (session.user.id === undefined) {
      //   await connectDB();
      //   const user = await User.findOne({ email: session.user.email })
      //     .select("name role school")
      //     .populate({ path: "school", select: "name" });
      //   session.user.name = user.name;
      //   session.user.id = user._id.toString();
      //   session.user.schoolName = user.school.name;
      // }
      return session;
    },
    async jwt(params) {
      // console.log("jwt//", params);
      if (params.user) {
        params.token.id = params.user.id;
        params.token.schoolName = params.user.schoolName;
        params.token.schoolRole = params.user.schoolRole;
      }
      return params.token;
    },
  },

  session: {
    strategy: "jwt" as any,
  },
  secret: process.env.authSecret,
  pages: {
    signIn: "/login",
  },
};
