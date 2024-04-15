"use server";

import Subject from "@/models/Subject";
import { SubjectDoc } from "@/types/monggModels";

export async function getNavSubjects(
  user: {
    schoolRole: string;
    _id: string;
  },
  subjectsIds: string[]
) {
  const filter =
    user.schoolRole === "admin"
      ? { _id: subjectsIds }
      : user.schoolRole === "teacher"
      ? { _id: subjectsIds, teacher: user._id }
      : { _id: subjectsIds, students: user._id };

  let subjects = (await Subject.find(filter).select("name").lean()) as SubjectDoc[];
  subjects = subjects.map(sub => ({ ...sub, _id: sub._id.toString() })) as SubjectDoc[];

  return subjects;
}
