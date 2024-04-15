import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Task from "@/models/Task";
import { SubjectDoc, SubmittedTasksDoc, TaskDoc, UserDoc } from "@/types/monggModels";
import { Check, X } from "lucide-react";
import StudentSubmittedTaskData from "./StudentSubmittedTaskData";

interface Props {
  taskId: string;
}

const StudentsTable: React.FC<Props> = async ({ taskId }) => {
  const task = (await Task.findById(taskId)
    .select("_id submittedTasks")
    .populate({
      path: "subject",
      select: "students",
      populate: { path: "students", select: "name" },
    })
    .populate({ path: "submittedTasks", select: "student note files" })) as TaskDoc;

  const submittedTasksStudentId = (task.submittedTasks as SubmittedTasksDoc[]).map(st =>
    st.student.toString()
  );

  return (
    <Table className="mt-10">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Student Name</TableHead>
          <TableHead className="text-center">Submitted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {((task.subject as SubjectDoc).students as UserDoc[]).map(student => {
          const submittedTask = (task.submittedTasks as SubmittedTasksDoc[]).find(
            st => st.student.toString() === student._id.toString()
          );

          return (
            <TableRow key={student._id.toString()}>
              <TableCell className="font-medium text-center">
                {submittedTasksStudentId.includes(student._id.toString()) ? (
                  <StudentSubmittedTaskData
                    studentName={student.name}
                    note={submittedTask!.note}
                    files={submittedTask!.files}
                  />
                ) : (
                  student.name
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                {submittedTasksStudentId.includes(student._id.toString()) ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500 " />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StudentsTable;
