"use client";

import Link from "next/link";
import AvatarDropdown from "./AvatarDropdown";
import MobileNav from "./MobileNav";
import { useSession } from "next-auth/react";
import { MdOutlineLogin } from "react-icons/md";
import ThemeChangerBtn from "@/components/ui/ThemeChangerBtn";
import { Button } from "../ui/button";

const RightSideNavbar: React.FC<{ showLinks: boolean }> = ({ showLinks }) => {
  const { data: session } = useSession();

  return (
    <div className="flex gap-5">
      {session ? (
        <AvatarDropdown schoolName={session.user.schoolName} username={session.user.name || ""} />
      ) : (
        <Link href="/auth">
          <Button>
            <MdOutlineLogin className="me-2" />
            Login
          </Button>
        </Link>
      )}
      <ThemeChangerBtn />
      {showLinks && <MobileNav />}
    </div>
  );
};

export default RightSideNavbar;
