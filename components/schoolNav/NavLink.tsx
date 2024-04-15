"use client";

import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { NotebookPen } from "lucide-react";
import { SubjectDoc } from "@/types/monggModels";
import { usePathname } from "next/navigation";

interface Props {
  schoolName: string;
  subject: SubjectDoc;
}

export const NavLink: React.FC<Props> = ({ schoolName, subject }) => {
  const path = usePathname();

  const isSubjectActive =
    path.endsWith(`${subject._id}/tasks`) ||
    path.endsWith(`${subject._id}/tests`) ||
    path.endsWith(`${subject._id}/files`) ||
    path.endsWith(`${subject._id}/grades`);

  return (
    <Link
      href={`/schools/${schoolName}/subjects/${subject._id}/tasks`}
      className={cn(
        buttonVariants({ size: "sm" }),
        isSubjectActive
          ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
          : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
        "justify-start w-full"
      )}
    >
      <NotebookPen className="mr-2 h-4 w-4" />
      {subject.name}
    </Link>
  );
};
