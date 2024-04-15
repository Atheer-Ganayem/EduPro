import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
import { UserDoc } from "@/types/monggModels";
import EditUserForm from "./EditUserForm";

interface Props {
  user: UserDoc;
}

const EditUserDialog: React.FC<Props> = ({ user }) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <Pen />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ُEdit User</DialogTitle>
          <DialogDescription>User: {user.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <EditUserForm initialUser={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
