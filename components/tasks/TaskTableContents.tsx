import React from "react";
import { TableRow } from "../ui/table";
import TaskRow from "./TaskRow";
import Task from "@/models/Task";
import { TaskDoc } from "@/types/monggModels";

interface Props {
  taskIds: string[];
  clientUser: { schoolRole: "student" | "teacher" | "admin"; _id: string };
  query: "all" | "on going";
  subjectName: string;
}

const TaskTableContents: React.FC<Props> = async ({ clientUser, query, taskIds, subjectName }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filter =
    query === "all"
      ? { _id: taskIds }
      : {
          _id: taskIds,
          deadline: { $gte: today },
        };

  const tasks = (await Task.find(filter)
    .select("title description deadline isRequired createdAt")
    .lean()) as TaskDoc[];

  tasks.sort((a, b) => b.deadline.getTime() - a.deadline.getTime());

  return (
    <>
      {tasks.map(task => {
        return (
          <TableRow key={task._id.toString()} className="text-center">
            <TaskRow
              taskId={task._id.toString()}
              title={task.title}
              description={task.description}
              deadline={task.deadline}
              isRequired={task.isRequired}
              subjectName={subjectName}
              clientUser={clientUser}
            />
          </TableRow>
        );
      })}
    </>
  );
};

export default TaskTableContents;
