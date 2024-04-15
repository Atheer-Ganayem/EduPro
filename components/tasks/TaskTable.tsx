import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskTableContents from "./TaskTableContents";
import { Suspense } from "react";
import RowSkeleton from "./RowSkeleton";
import Filters from "./Filters";

interface Props {
  tasksIds: string[];
  clientUser: { schoolRole: "student" | "teacher" | "admin"; _id: string };
  subjectName: string;
  status: string | undefined;
  path: string;
}

const TaskTable: React.FC<Props> = ({ tasksIds, clientUser, subjectName, status, path }) => {
  return (
    <>
      <Filters status={!status ? "on going" : status === "all" ? "all" : "on going"} path={path} />
      <Table>
        <TableCaption>
          {tasksIds.length > 0 ? "A list of all subject's tasks." : "No tasks"}
        </TableCaption>
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Subject</TableHead>
            <TableHead className="text-center">Deadline</TableHead>
            <TableHead className="text-center">Task Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense fallback={<RowSkeleton />}>
            <TaskTableContents
              clientUser={clientUser}
              subjectName={subjectName}
              taskIds={tasksIds}
              query={!status ? "on going" : status === "all" ? "all" : "on going"}
            />
          </Suspense>
        </TableBody>
      </Table>
    </>
  );
};

export default TaskTable;
