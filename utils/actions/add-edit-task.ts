"use server";

import Subject from "@/models/Subject";
import Task from "@/models/Task";
import User from "@/models/User";
import { SchoolDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../authOptions";

type Data = {
  title: string;
  description: string;
  required: boolean;
  deadline: Date;
  subjectId: string;
};

export const addTask: (
  values: Data
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
    const clientUser = (await User.findById(session.user.id)
      .select("school schoolRole")
      .populate({ path: "school", select: "name" })) as UserDoc;

    if (!clientUser || clientUser.schoolRole === "student") {
      return { error: true, message: "Not authorized", code: 401 };
    }
    clientUser.school = clientUser.school as SchoolDoc;

    const subject = (await Subject.findById(values.subjectId).select(
      "school teacher tasks"
    )) as SubjectDoc;
    if (!subject) {
      return { error: true, message: "subject not found", code: 404 };
    } else if (subject.school.toString() !== clientUser.school._id.toString()) {
      return { error: true, message: "Not authorized", code: 401 };
    } else if (
      clientUser.schoolRole === "teacher" &&
      subject.teacher.toString() !== clientUser._id.toString()
    ) {
      return { error: true, message: "Not authorized", code: 401 };
    }

    const task = await Task.create({
      title: values.title,
      description: values.description,
      subject: subject._id,
      submittedTasks: [],
      deadline: values.deadline,
      isRequired: values.required,
    });

    subject.tasks.push(task);
    await subject.save();

    revalidatePath(`/schools/${clientUser.school.name}/sbujects/${values.subjectId}/tasks`);

    return { error: false, message: "User created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return { error: true, message: "An error has occurred, please try again later.", code: 500 };
  }
};

function validate({ title, deadline }: Data): boolean {
  if (title.length < 3) {
    return false;
  }
  const today = new Date();
  const isToday =
    deadline.getDate() === today.getDate() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getFullYear() === today.getFullYear();

  if (!isToday && deadline.getTime() - new Date().getTime() < 0) {
    return false;
  }
  return true;
}
