"use server";

import Subject from "@/models/Subject";
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
  title: string;
  description: string;
  subjectId: string;
};

const s3 = new S3({
  region: "eu-central-1",
});

export const addMaterial: (values: Data) => Promise<Res> = async values => {
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
    } else if (clientUser.schoolRole === "student") {
      return notAuthorized();
    }
    clientUser.school = clientUser.school as SchoolDoc;

    const subject = (await Subject.findById(values.subjectId).select(
      "school teacher"
    )) as SubjectDoc;
    if (!subject) {
      return notFound();
    } else if (subject.school.toString() !== clientUser.school._id.toString()) {
      return notAuthorized();
    } else if (
      clientUser.schoolRole === "teacher" &&
      clientUser._id.toString() !== subject.teacher.toString()
    ) {
      return notAuthorized();
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

    await Subject.updateOne(
      { _id: values.subjectId },
      {
        $push: {
          materials: {
            title: values.title,
            description: values.description,
            files: fileNames,
            createdAt: new Date(),
          },
        },
      }
    );

    revalidatePath(
      `/schools/${clientUser.school.name.toString()}/sbujects/${values.subjectId}/materials`
    );

    return { error: false, message: "Material created and added successfully", code: 201 };
  } catch (error) {
    console.log(error);
    return serverSideError();
  }
};

function validate(values: Data): boolean {
  const files = values.formData.getAll("file") as File[];
  if (files.length === 0) {
    return false;
  } else if (values.title.length < 3) {
    return false;
  } else if (!validateMimeType(files)) {
    return false;
  }
  return true;
}

export const removeMaterial: (materialId: string, subjectId: string) => Promise<Res> = async (
  materialId,
  subjectId
) => {
  try {
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
    } else if (clientUser.schoolRole === "student") {
      return notAuthorized();
    }
    clientUser.school = clientUser.school as SchoolDoc;

    const subject = (await Subject.findById(subjectId).select(
      "school teacher materials"
    )) as SubjectDoc;
    if (!subject) {
      return notFound();
    } else if (subject.school.toString() !== clientUser.school._id.toString()) {
      return notAuthorized();
    } else if (
      clientUser.schoolRole === "teacher" &&
      clientUser._id.toString() !== subject.teacher.toString()
    ) {
      return notAuthorized();
    }

    const materialIndex = subject.materials.findIndex(
      material => material._id.toString() === materialId
    );
    if (materialIndex === -1) {
      return notFound();
    }
    subject.materials[materialIndex].files.forEach(async file => {
      await s3.deleteObject({ Bucket: "edupro-project", Key: file });
    });
    subject.materials.splice(materialIndex, 1);

    await subject.save();

    revalidatePath(`/schools/${clientUser.school.name.toString()}/sbujects/${subjectId}/materials`);

    return { error: false, message: "Material removed successfully", code: 201 };
  } catch (error) {
    console.log(error);
    return serverSideError();
  }
};
