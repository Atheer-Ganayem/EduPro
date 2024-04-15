import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import SideNav from "../schoolNav/SideNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RiMenuFill } from "react-icons/ri";
import RightSideNavbar from "./RightSideNavbar";

const LINKS = [
  { text: "Home", link: "/#nav" },
  { text: "About Us", link: "/#about-us" },
  { text: "Features", link: "/#features" },
  { text: "Contact Us", link: "/#contact-us" },
];

interface Props {
  showLinks: boolean;
  subjectsIds: string[];
  schoolRole: "admin" | "student" | "teacher";
  userId: string;
  schoolName: string;
}

const Navbar: React.FC<Props> = ({ showLinks, subjectsIds, schoolName, schoolRole, userId }) => {
  return (
    <header className="shadow-md relative dark:bg-black bg-white">
      <nav id="nav" className="container mx-auto p-4 flex justify-between">
        <h1 className="font-bold text-xl flex items-center">
          {!showLinks && (
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger>
                  <RiMenuFill className="me-5" size={24} />
                </SheetTrigger>
                <SheetContent side="left">
                  <SideNav
                    subjects={subjectsIds}
                    schoolRole={schoolRole}
                    schoolName={schoolName}
                    userId={userId}
                  />
                </SheetContent>
              </Sheet>
            </div>
          )}
          <Link href="/">EduPro</Link>
        </h1>
        {showLinks && (
          <ul className="gap-4 hidden lg:flex">
            {LINKS.map(link => (
              <li key={link.link}>
                <Link href={link.link}>
                  <Button variant="ghost">{link.text}</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <RightSideNavbar showLinks={showLinks} />
      </nav>
    </header>
  );
};

export default Navbar;
