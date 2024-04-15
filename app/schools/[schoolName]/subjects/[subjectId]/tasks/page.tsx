import AddTask from "@/components/tasks/AddTask";
import TaskTable from "@/components/tasks/TaskTable";
import Subject from "@/models/Subject";
import User from "@/models/User";
import type { SchoolDoc, SubjectDoc, TaskDoc, UserDoc } from "@/types/monggModels";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { subjectId: string };
  searchParams: { status: string | undefined };
}

const page: React.FC<Props> = async ({ params, searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }
  const clientUser = (await User.findById(session.user.id)
    .select("schoolRole school")
    .populate({ path: "school", select: "name _id" })
    .lean()) as UserDoc;

  const subject = (await Subject.findById(params.subjectId)
    .select("school teacher name tasks")
    .select({ students: { $elemMatch: { $eq: clientUser._id } } })
    // .populate({ path: "tasks", select: "title description deadline isRequired createdAt" })
    .lean()) as SubjectDoc;

  if (!subject) {
    notFound();
  }

  if (
    !clientUser ||
    (clientUser.school as SchoolDoc)._id.toString() !== subject.school.toString()
  ) {
    redirect("/auth");
  }

  if (clientUser.schoolRole === "student" && !subject.students) {
    notFound();
  } else if (
    clientUser.schoolRole === "teacher" &&
    subject.teacher.toString() !== clientUser._id.toString()
  ) {
    notFound();
  }

  return (
    <div>
      {(clientUser.schoolRole === "admin" || clientUser.schoolRole === "teacher") && (
        <div className="text-end mb-10">
          <AddTask subjectId={params.subjectId} />
        </div>
      )}
      <TaskTable
        subjectName={subject.name}
        clientUser={{ schoolRole: clientUser.schoolRole, _id: clientUser._id.toString() }}
        tasksIds={subject.tasks.map(s => s.toString()) as string[]}
        status={searchParams.status}
        path={`/schools/${
          (clientUser.school as SchoolDoc).name
        }/subjects/${subject._id.toString()}/tasks`}
      />
    </div>
  );
};

export default page;
