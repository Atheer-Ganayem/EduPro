import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddUserForm from "./AddUserForm";

const AddUserDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add a New User <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New User</DialogTitle>
          <DialogDescription>
            Add a new user to your school (student, teacher or an admin)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddUserForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
