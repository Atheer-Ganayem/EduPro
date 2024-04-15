import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
require("@/models/School");
import User from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import { SchoolDoc, UserDoc } from "@/types/monggModels";
import { authOptions } from "@/utils/authOptions";

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    id: string;
    schoolName: string;
    schoolRole: string;
  }

  interface Session {
    user: {
      email: string;
      name: string;
      id: string;
      schoolName: string;
      schoolRole: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
