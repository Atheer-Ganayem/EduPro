import React from "react";
import { TableCell } from "../ui/table";
import SubmittedTask from "@/models/SubmittedTask";
import { Badge } from "../ui/badge";
import TaskSheet from "./TaskSheet";
import { SubmittedTasksDoc } from "@/types/monggModels";
import { Ban, Check, Clock } from "lucide-react";

interface Props {
  title: string;
  description: string;
  deadline: Date;
  isRequired: boolean;
  subjectName: string;
  taskId: string;
  clientUser: { schoolRole: "student" | "teacher" | "admin"; _id: string };
}

const TaskRow: React.FC<Props> = async ({
  title,
  description,
  deadline,
  isRequired,
  clientUser,
  subjectName,
  taskId,
}) => {
  const status: { variant: "default" | "destructive"; text: string } = {
    variant: "default",
    text: "On going",
  };

  const today = new Date();
  const isToday =
    deadline.getDate() === today.getDate() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getFullYear() === today.getFullYear();

  if (!isToday && deadline.getTime() - new Date().getTime() < 0) {
    status.variant = "destructive";
    status.text = "Expired";
  }

  let submittedTask = null;

  if (clientUser.schoolRole === "student") {
    status.variant = "destructive";
    status.text = "Not submitted";

    submittedTask = (await SubmittedTask.findOne({
      task: taskId,
      student: clientUser._id,
    })
      .select("_id files note createdAt")
      .lean()) as SubmittedTasksDoc;

    if (submittedTask) {
      submittedTask._id = submittedTask._id.toString();
      status.text = "Submitted";
      status.variant = "default";
    }
  }

  return (
    <>
      <TableCell>
        <TaskSheet
          clientUser={clientUser}
          taskId={taskId}
          title={title}
          description={description}
          deadline={deadline}
          submittedTask={submittedTask}
        />
      </TableCell>
      <TableCell>{subjectName}</TableCell>
      <TableCell>{deadline.toLocaleDateString("eng-US")}</TableCell>
      <TableCell>
        <Badge variant={isRequired ? "default" : "secondary"}>
          {isRequired ? "Required" : "Optional"}
        </Badge>
      </TableCell>
      <TableCell className="flex justify-center">
        <Badge
          variant={status.variant}
          className={`${
            status.variant === "default" ? "bg-green-500 text-white hover:bg-green-600" : undefined
          } gap-1`}
        >
          {status.text}
          {status.text === "On going" ? (
            <Clock />
          ) : status.text === "Submitted" ? (
            <Check />
          ) : (
            <Ban />
          )}
        </Badge>
      </TableCell>
    </>
  );
};

export default TaskRow;
