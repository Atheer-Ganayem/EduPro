"use client";

import { Student } from "@/types/other-types";
import { TableCell, TableRow } from "../ui/table";
import { Input } from "@/components/ui/input";

interface Props {
  maxGrade: number;
  student: Student;
  updateStudentGradeHandler: (studentId: string, newGrade: number) => void;
}

const AddGradeRow: React.FC<Props> = ({ maxGrade, student, updateStudentGradeHandler }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="Email"
          className="w-[70px] inline me-1 text-center"
          value={student.grade}
          min={0}
          max={maxGrade}
          onChange={e => updateStudentGradeHandler(student._id, parseInt(e.target.value) || 0)}
        />
        /{maxGrade}
      </TableCell>
    </TableRow>
  );
};

export default AddGradeRow;
