"use client";

import React from "react";
import { RiMenuFill } from "react-icons/ri";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";

const LINKS = [
  { text: "Home", link: "/#nav" },
  { text: "About Us", link: "/#about-us" },
  { text: "Features", link: "/#features" },
  { text: "Contact Us", link: "/#contact-us" },
];

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <RiMenuFill size="30" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-2xl">EduPro</SheetTitle>
          <SheetDescription>
            <ul className="flex flex-col gap-4 mt-3">
              {LINKS.map(link => (
                <li key={link.link}>
                  <Link href={link.link}>
                    <Button variant="ghost" className="w-full text-start">
                      {link.text}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
