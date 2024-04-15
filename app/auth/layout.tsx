import type { Metadata } from "next";
import "../globals.css";
import { Inter as FontSans } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EduPro | Auth",
  description: "Login or create a new EduPro account.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar schoolName="" userId="" showLinks={true} subjectsIds={[]} schoolRole="student" />
      {children}
    </>
  );
}
