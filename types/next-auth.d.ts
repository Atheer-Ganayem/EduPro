import { type DefaultSession, type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      schoolName: string;
      name: string;
      email: string;
      schoolRole: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
    schoolName: string;
    name: string;
    email: string;
    schoolRole: string;
  }
}
