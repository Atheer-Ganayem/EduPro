import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTaskForm from "./AddTaskForm";

const AddTask: React.FC<{ subjectId: string }> = ({ subjectId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ms-auto">
          Add a New Task <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
          <DialogDescription>Add a new task to the subject.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddTaskForm subjectId={subjectId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTask;
