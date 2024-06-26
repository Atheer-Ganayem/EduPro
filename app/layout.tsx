import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./theme-provider";
import { getServerSession } from "next-auth";
import AuthSessionProvider from "./AuthSessionProvider";
import { authOptions } from "@/utils/authOptions";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EduPro",
  description: "Manage your school's students & tasks & grades & more!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider session={session}>
            <main>{children}</main>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
