"use server";

import Subject from "@/models/Subject";
import User from "@/models/User";
import { SchoolDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  Res,
  invalidClientInputs,
  notAuthenticated,
  notAuthorized,
  notFound,
} from "../http-helpers";
import Grade from "@/models/Grade";
import { Types } from "mongoose";
import { authOptions } from "../authOptions";

type Data = {
  title: string;
  maxGrade: number;
  students: { student: string; grade: number }[];
  subjectId: string;
  gradeId?: string;
};

export const addGrade: (values: Data) => Promise<Res> = async values => {
  try {
    if (!validate(values)) {
      return invalidClientInputs();
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthenticated();
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id)
      .select("school schoolRole")
      .populate({ path: "school", select: "name" })) as UserDoc;

    if (!clientUser || clientUser.schoolRole === "student") {
      return notAuthorized();
    }
    clientUser.school = clientUser.school as SchoolDoc;

    const subject = (await Subject.findById(values.subjectId)
      .select("school teacher students")
      .lean()) as SubjectDoc;

    if (!subject) {
      return notFound();
    } else if (subject.school.toString() !== clientUser.school._id.toString()) {
      return notAuthorized();
    } else if (
      clientUser.schoolRole === "teacher" &&
      subject.teacher.toString() !== clientUser._id.toString()
    ) {
      return notAuthorized();
    }

    // validating student ids
    const subjectStudentIds = subject.students.map(s => {
      return s.toString();
    }) as string[];
    const notExistIndex = values.students.findIndex(
      student => !subjectStudentIds.includes(student.student)
    );

    if (notExistIndex !== -1) {
      return notFound();
    }

    // add & saving to DB
    const avg =
      values.students.reduce((prev, current) => prev + current.grade, 0) / values.students.length;

    if (values.gradeId) {
      await Grade.findByIdAndUpdate(values.gradeId, {
        subject: values.subjectId,
        grades: values.students,
        avg,
        title: values.title,
        maxGrade: values.maxGrade,
      });
    } else {
      await Grade.create({
        subject: values.subjectId,
        grades: values.students,
        avg,
        title: values.title,
        maxGrade: values.maxGrade,
      });
    }

    revalidatePath(`/schools/${clientUser.school.name}/sbujects/${values.subjectId}/grades`);

    return { error: false, message: "User created/updated an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return { error: true, message: "An error has occurred, please try again later.", code: 500 };
  }
};

function validate({ title, students, maxGrade }: Data): boolean {
  if (title.length < 3) {
    return false;
  } else if (maxGrade > 100) {
    return false;
  }
  const invalidGradeIndex = students.findIndex(s => s.grade > maxGrade || s.grade < 0);
  if (invalidGradeIndex !== -1) {
    return false;
  }

  return true;
}
