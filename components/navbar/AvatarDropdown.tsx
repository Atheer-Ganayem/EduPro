import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, School } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const AvatarDropdown: React.FC<{ username: string; schoolName: string }> = ({
  username,
  schoolName,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`}
            alt="@shadcn"
            className="w-9 rounded-full hover:cursor-pointer"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <Link href={`/schools/${schoolName}/tasks`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              <School className="mr-2 h-4 w-4" />
              <span>My School</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="hover:cursor-pointer" disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 hover:cursor-pointer"
          onClick={() => {
            signOut({ callbackUrl: "/auth" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
