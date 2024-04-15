"use server";

import Subject from "@/models/Subject";
import SubmittedTask from "@/models/SubmittedTask";
import Task from "@/models/Task";
import User from "@/models/User";
import { SchoolDoc, SubjectDoc, SubmittedTasksDoc, TaskDoc, UserDoc } from "@/types/monggModels";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  Res,
  invalidClientInputs,
  notAuthenticated,
  notAuthorized,
  notFound,
  serverSideError,
} from "../http-helpers";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { validateMimeType } from "../mime-type-validation";
import { authOptions } from "../authOptions";

type Data = {
  formData: FormData;
  notes: string;
  taskId: string;
  subjectId: string;
};

const s3 = new S3({
  region: "eu-central-1",
});

export const submitTask: (values: Data) => Promise<Res> = async values => {
  try {
    const files = values.formData.getAll("file") as File[];

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

    if (!clientUser) {
      return notAuthenticated();
    }
    clientUser.school = clientUser.school as SchoolDoc;

    const subject = (await Subject.findById(values.subjectId).select(
      "school students"
    )) as SubjectDoc;
    const indexOfStudent = subject.students.findIndex(
      s => s.toString() === clientUser._id.toString()
    );

    if (
      subject.school.toString() !== clientUser.school._id.toString() ||
      clientUser.schoolRole !== "student" ||
      indexOfStudent === -1
    ) {
      return notAuthorized();
    }
    const existingSubmittedTask = await Task.findOne({
      student: clientUser._id,
      task: values.taskId,
    });
    if (existingSubmittedTask) {
      return { error: true, message: "Task already submitted", code: 422 };
    }

    const task = (await Task.findById(values.taskId).select("submittedTasks")) as TaskDoc;
    if (!task) {
      return notFound();
    }

    const fileNames: string[] = [];

    for (const file of files) {
      const bufferedImage = await file.arrayBuffer();
      const fileName = "task-" + uuidv4() + "." + file.name.split(".").pop();
      fileNames.push(fileName);

      s3.putObject({
        Bucket: "edupro-project",
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: file.type,
      });
    }

    const submittedTask = (await SubmittedTask.create({
      student: clientUser._id,
      task: task._id,
      files: fileNames,
      note: values.notes,
    })) as SubmittedTasksDoc;

    task.submittedTasks.push(submittedTask._id);

    await task.save();

    revalidatePath(
      `/schools/${clientUser.school._id.toString()}/sbujects/${values.subjectId}/tasks`
    );

    return { error: false, message: "User created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);
    return serverSideError();
  }
};

function validate(values: Data): boolean {
  const files = values.formData.getAll("file") as File[];
  if (files.length === 0 && !values.notes) {
    return false;
  } else if (!validateMimeType(files)) {
    return false;
  }
  return true;
}
