import type { Metadata } from "next";
import "../../globals.css";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";
import SideNav from "@/components/schoolNav/SideNav";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";
import { SchoolDoc, UserDoc } from "@/types/monggModels";
import { authOptions } from "@/utils/authOptions";

export async function generateMetadata({
  params,
}: {
  params: { schoolName: string };
}): Promise<Metadata> {
  return {
    title: `Swipe | ${params.schoolName}`,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { schoolName: string };
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  await connectDB();
  const user = (await User.findById(session.user.id)
    .select("-password")
    .populate({ path: "school", select: "name subjects" })
    .lean()) as UserDoc;
  if (!user || (user.school as SchoolDoc).name !== params.schoolName) {
    redirect("/auth");
  }

  return (
    <>
      <div className="fixed w-full">
        <Navbar
          showLinks={false}
          subjectsIds={(user.school as SchoolDoc).subjects.map(s => s.toString()) as string[]}
          schoolRole={user.schoolRole}
          userId={user._id.toString()}
          schoolName={(user.school as SchoolDoc).name}
        />
      </div>
      <div className="flex gap-5">
        <aside className="hidden lg:block w-60 ">
          <SideNav
            subjects={(user.school as SchoolDoc).subjects.map(s => s.toString()) as string[]}
            schoolRole={user.schoolRole}
            userId={user._id.toString()}
            schoolName={(user.school as SchoolDoc).name}
          />
        </aside>
        <main className="mt-32 container ms-0">{children}</main>
      </div>
    </>
  );
}
