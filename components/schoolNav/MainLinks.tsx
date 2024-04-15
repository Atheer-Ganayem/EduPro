"use client";

import { ClipboardCheck, Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mainLinks = [
  // { title: "Home", path: "", icon: Home, variant: "default" },
  { title: "Tasks", path: "/tasks", icon: ClipboardCheck, variant: "default" },
];

const MainLinks = () => {
  const path = usePathname();
  const params = useParams() as { schoolName: string };

  return (
    <>
      {mainLinks.map((link, index) => (
        <Link
          key={link.path + index}
          href={`/schools/${params.schoolName}${link.path}`}
          className={cn(
            buttonVariants({ size: "sm" }),
            path === `/schools/${params.schoolName}${link.path}`
              ? "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              : "bg-transparent text-black hover:text-white dark:text-white dark:hover:bg-muted",
            "justify-start"
          )}
        >
          <link.icon className="mr-2 h-4 w-4" />
          {link.title}
        </Link>
      ))}
    </>
  );
};

export default MainLinks;
