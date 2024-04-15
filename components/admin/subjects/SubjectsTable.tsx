import type { SubjectDoc, UserDoc } from "@/types/monggModels";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditSubject from "./EditSubjects";

interface Props {
  subjects: SubjectDoc[];
  allStudents: UserDoc[];
  allTeachers: UserDoc[];
}

const SubjectsTable: React.FC<Props> = ({ subjects, allStudents, allTeachers }) => {
  return (
    <Table>
      <TableCaption>A list of all subjects in the school.</TableCaption>
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="text-center">ID</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">{"Teacher's name"}</TableHead>
          <TableHead className="text-center">Number of students</TableHead>
          <TableHead className="text-center">Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map(subject => {
          subject.teacher = subject.teacher as UserDoc;
          return (
            <TableRow key={subject._id.toString()} className="text-center">
              <TableCell>{subject._id.toString()}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.teacher.name}</TableCell>
              <TableCell>{subject.students.length}</TableCell>
              <TableCell className="flex justify-center">
                <EditSubject
                  students={allStudents}
                  teachers={allTeachers}
                  initStudents={subject.students.map(s => s.toString())}
                  initTeacherId={subject.teacher._id.toString()}
                  subjectName={subject.name}
                  subjectId={subject._id.toString()}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SubjectsTable;
