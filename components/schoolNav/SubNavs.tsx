"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const SubNavs: React.FC<{ subjectId: string; schoolName: string }> = ({
  subjectId,
  schoolName,
}) => {
  const path = usePathname();

  const isSubjectActive =
    path.endsWith(`${subjectId}/tasks`) ||
    path.endsWith(`${subjectId}/tests`) ||
    path.endsWith(`${subjectId}/materials`) ||
    path.endsWith(`${subjectId}/grades`);

  if (!isSubjectActive) {
    return <></>;
  }
  return (
    <>
      <div className="flex flex-col gap-2 mt-2">
        <Link
          href={`/schools/${schoolName}/subjects/${subjectId}/tasks`}
          className={cn(
            buttonVariants({ size: "sm" }),
            path.endsWith(`${subjectId}/tasks`)
              ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
            "justify-start w-11/12 ms-auto"
          )}
        >
          • Tasks
        </Link>

        <Link
          href={`/schools/${schoolName}/subjects/${subjectId}/grades`}
          className={cn(
            buttonVariants({ size: "sm" }),
            path.endsWith(`${subjectId}/grades`)
              ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
            "justify-start w-11/12 ms-auto"
          )}
        >
          • Grades
        </Link>
        <Link
          href={`/schools/${schoolName}/subjects/${subjectId}/materials`}
          className={cn(
            buttonVariants({ size: "sm" }),
            path.endsWith(`${subjectId}/materials`)
              ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
            "justify-start w-11/12 ms-auto"
          )}
        >
          • Materials
        </Link>
      </div>
    </>
  );
};

export default SubNavs;
