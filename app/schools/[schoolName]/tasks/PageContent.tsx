import AddTask from "@/components/tasks/AddTask";
import Filters from "@/components/tasks/Filters";
import RowSkeleton from "@/components/tasks/RowSkeleton";
import TaskRow from "@/components/tasks/TaskRow";
import TaskTable from "@/components/tasks/TaskTable";
import TaskTableContents from "@/components/tasks/TaskTableContents";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Task from "@/models/Task";
import { SchoolDoc, UserDoc } from "@/types/monggModels";

interface Props {
  status: string;
  clientUser: UserDoc;
  tasksIds: string[];
}

const PageContent: React.FC<Props> = async ({ clientUser, status, tasksIds }) => {
  const deadlineFilter =
    status === "all" ? {} : { deadline: { $gte: new Date().setHours(0, 0, 0) } };

  const tasks = await Task.find({ _id: tasksIds, ...deadlineFilter })
    .select("title description deadline isRequired")
    .populate({ path: "subject", select: "name" });

  tasks.sort((a, b) => b.deadline.getTime() - a.deadline.getTime());

  return (
    <>
      <Filters
        status={!status ? "on going" : status === "all" ? "all" : "on going"}
        path={`/schools/${(clientUser.school as SchoolDoc).name}/tasks`}
      />
      <Table>
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
          {tasks.map(task => (
            <TableRow key={task._id.toString()} className="text-center">
              <TaskRow
                taskId={task._id.toString()}
                title={task.title}
                description={task.description}
                deadline={task.deadline}
                isRequired={task.isRequired}
                subjectName={task.subject.name}
                clientUser={{
                  schoolRole: clientUser.schoolRole,
                  _id: clientUser._id.toString(),
                }}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PageContent;
