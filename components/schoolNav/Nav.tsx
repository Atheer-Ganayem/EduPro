import { headers } from "next/headers";
import Link from "next/link";
import { ClipboardCheck, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Subjects from "./Subjects";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import AdminLinks from "./AdminLinks";
import MainLinks from "./MainLinks";

const mainLinks = [
  { title: "Home", path: "/", icon: Home, variant: "default" },
  { title: "Tasks", path: "/tasks", icon: ClipboardCheck, variant: "default" },
];

interface Props {
  subjects: string[];
  schoolRole: "admin" | "student" | "teacher";
  userId: string;
  schoolName: string;
}

export const Nav: React.FC<Props> = ({ subjects, schoolRole, userId, schoolName }) => {
  const headersList = headers();
  const domain = headersList.get("host") || "";
  const path = headersList.get("referer") || "";

  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 mt-28">
      <nav className="w-60 fixed grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <h1 className="font-bold p-2 flex justify-between items-center">Main</h1>
        <MainLinks />
        <hr />
        <h1 className="font-bold p-2 flex justify-between items-center">Subjects</h1>
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          }
        >
          <Subjects
            subjectsIds={subjects}
            path={path}
            user={{ _id: userId, schoolRole, schoolName: schoolName }}
          />
        </Suspense>
        <hr />
        {schoolRole === "admin" && (
          <h1 className="font-bold p-2 flex justify-between items-center">Admin</h1>
        )}
        {schoolRole === "admin" && <AdminLinks schoolName={schoolName} />}
      </nav>
    </div>
  );
};

export default Nav;
