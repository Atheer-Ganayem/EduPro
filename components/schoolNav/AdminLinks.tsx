"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { BookUser, GraduationCap } from "lucide-react";

const adminLinks = [
  {
    title: "Users",
    icon: BookUser,
    variant: "default",
    path: "/admin/users",
  },
  {
    title: "Subjects",
    icon: GraduationCap,
    variant: "default",
    path: "/admin/subjects",
  },
];

interface Props {
  schoolName: string;
}

const AdminLinks: React.FC<Props> = ({ schoolName }) => {
  const path = usePathname();

  return adminLinks.map((link, index) => (
    <Link
      key={index}
      href={`/schools/${schoolName}${link.path}`}
      className={cn(
        buttonVariants({ variant: link.variant as any, size: "sm" }),
        path.endsWith(link.path)
          ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
          : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
        "justify-start"
      )}
    >
      <link.icon className="mr-2 h-4 w-4" />
      {link.title}
    </Link>
  ));
};

export default AdminLinks;
