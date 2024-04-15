import type { SchoolDoc, UserDoc } from "@/types/monggModels";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";
import { redirect } from "next/navigation";
import School from "@/models/School";
import EditUserDialog from "./EditUserDialog";

const UsersTable: React.FC<{ email: string }> = async ({ email }) => {
  await connectDB();
  const user = (await User.findOne({ email: email }).select("-password").lean()) as UserDoc;
  if (!user || user.schoolRole !== "admin") {
    redirect("/auth");
  }

  const school = (await School.findById(user.school)
    .populate({
      path: "students",
      select: "name email schoolRole",
    })
    .populate({
      path: "teachers",
      populate: {
        path: "teacher",
        select: "name email schoolRole",
      },
    })
    .lean()) as SchoolDoc;

  return (
    <Table>
      <TableCaption>A list of all users associated with the school.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">ID</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Email</TableHead>
          <TableHead className="text-center">Role</TableHead>
          <TableHead className="text-center">Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {school.teachers.map(teacher => {
          teacher.teacher = teacher.teacher as UserDoc;
          return (
            <TableRow key={teacher.teacher._id.toString()} className="text-center">
              <TableCell>{teacher.teacher._id}</TableCell>
              <TableCell>{teacher.teacher.name}</TableCell>
              <TableCell>{teacher.teacher.email}</TableCell>
              <TableCell>
                <Badge
                  variant={teacher.teacher.schoolRole === "admin" ? "destructive" : "default"}
                  className={
                    teacher.teacher.schoolRole === "teacher"
                      ? "bg-orange-600 text-white hover:bg-orange-500"
                      : undefined
                  }
                >
                  {teacher.teacher.schoolRole}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center">
                <EditUserDialog user={teacher.teacher} />
              </TableCell>
            </TableRow>
          );
        })}
        {school.students.map(student => {
          student = student as UserDoc;
          return (
            <TableRow key={student._id} className="text-center">
              <TableCell>{student._id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Badge>{student.schoolRole}</Badge>
              </TableCell>
              <TableCell className="flex justify-center">
                <EditUserDialog user={student} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
