"use server";

import School from "@/models/School";
import Subject from "@/models/Subject";
import User from "@/models/User";
import { SchoolDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import { connectDB } from "@/utils/connectDB";
import mongoose, { ObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../authOptions";

interface AddData {
  name: string;
  teacher: string;
  students: string[];
}

export const addSubject: (
  values: AddData
) => Promise<{ error: boolean; message: string; code: number }> = async values => {
  try {
    if (!validate(values)) {
      return { error: true, message: "Invalid input", code: 422 };
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: true, message: "Not authenticated", code: 403 };
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id).select("-password")) as UserDoc;

    if (!clientUser || clientUser.schoolRole !== "admin") {
      return { error: true, message: "Not authorized", code: 401 };
    }

    const school = (await School.findById(clientUser.school).select(
      "subjects students name teachers"
    )) as SchoolDoc;

    // validating the student ids
    const studentsStringIds = school.students.map(studentId => studentId.toString());
    const studentsNotInTheSchool = values.students.filter(id => !studentsStringIds.includes(id));
    if (studentsNotInTheSchool.length !== 0) {
      return {
        error: true,
        message: "You're trying to add a student that's not in the school",
        code: 422,
      };
    }
    // validating the teacher
    const teacherIndex = school.teachers.findIndex(
      teacher => teacher.teacher!.toString() === values.teacher
    );

    if (teacherIndex === -1) {
      return {
        error: true,
        message: "You're trying to add a teacher that's not in the school",
        code: 422,
      };
    }

    const subject = (await Subject.create({
      name: values.name,
      students: values.students,
      school: school._id,
      teacher: values.teacher,
    })) as SubjectDoc;

    school.subjects.push(subject._id);

    await school.save();

    revalidatePath(`/schools/${school.name}/admin/subjects`);

    return { error: false, message: "Subject created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return { error: true, message: "An error has occurred, please try again later.", code: 500 };
  }
};

function validate({ name }: AddData): boolean {
  if (name.length < 3) {
    return false;
  }

  return true;
}

interface EditData extends AddData {
  subjectId: string;
}

export const editSubject: (
  values: EditData
) => Promise<{ error: boolean; message: string; code: number }> = async values => {
  try {
    if (!validate(values)) {
      return { error: true, message: "Invalid input", code: 422 };
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: true, message: "Not authenticated", code: 403 };
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id).select("-password")) as UserDoc;

    if (!clientUser || clientUser.schoolRole !== "admin") {
      return { error: true, message: "Not authorized", code: 401 };
    }

    const school = (await School.findById(clientUser.school).select(
      "subjects students name teachers"
    )) as SchoolDoc;

    // validating the student ids
    const studentsStringIds = school.students.map(studentId => studentId.toString());
    const studentsNotInTheSchool = values.students.filter(id => !studentsStringIds.includes(id));
    if (studentsNotInTheSchool.length !== 0) {
      return {
        error: true,
        message: "You're trying to add a student that's not in the school",
        code: 422,
      };
    }
    // validating the teacher
    const teacherIndex = school.teachers.findIndex(
      teacher => teacher.teacher!.toString() === values.teacher
    );

    if (teacherIndex === -1) {
      return {
        error: true,
        message: "You're trying to add a teacher that's not in the school",
        code: 422,
      };
    }

    const subject = (await Subject.findById(values.subjectId)) as SubjectDoc;
    if (!subject || subject.school.toString() !== school._id.toString()) {
      return { error: true, message: "Subject not found", code: 404 };
    }

    subject.name = values.name;
    subject.students = values.students;
    subject.teacher = new mongoose.Types.ObjectId(values.teacher);

    await school.save();
    await subject.save();

    revalidatePath(`/schools/${school.name}/admin/subjects`);

    return { error: false, message: "Subject created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return { error: true, message: "An error has occurred, please try again later.", code: 500 };
  }
};
