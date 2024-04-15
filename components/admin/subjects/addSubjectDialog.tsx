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
import AddSubjectForm from "./addSubjectForm";
import { UserDoc } from "@/types/monggModels";

interface Props {
  students: UserDoc[];
  teachers: UserDoc[];
}

const addSubjectDialog: React.FC<Props> = ({ students, teachers }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add a New Subject <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Subject</DialogTitle>
          <DialogDescription>Add a new Subject to your school</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddSubjectForm students={students} teachers={teachers} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default addSubjectDialog;
