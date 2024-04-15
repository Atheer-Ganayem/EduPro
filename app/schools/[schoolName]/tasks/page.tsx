import Filters from "@/components/tasks/Filters";
import RowSkeleton from "@/components/tasks/RowSkeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Subject from "@/models/Subject";
import User from "@/models/User";
import type { SchoolDoc, SubjectDoc, TaskDoc, UserDoc } from "@/types/monggModels";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";
import PageContent from "./PageContent";
import { authOptions } from "@/utils/authOptions";

interface Props {
  searchParams: { status: string | undefined };
}

const AllTasksPage: React.FC<Props> = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }
  const clientUser = (await User.findById(session.user.id)
    .select("schoolRole school")
    .populate({ path: "school", select: "name _id" })
    .lean()) as UserDoc;
  clientUser.school = clientUser.school as SchoolDoc;
  if (!clientUser) {
    return notFound();
  }

  let subjects;
  if (clientUser.schoolRole === "teacher") {
    subjects = (await Subject.find({
      school: clientUser.school._id,
      teacher: clientUser._id,
    })
      .select("school teacher name tasks")
      .lean()) as SubjectDoc[];
  } else {
    subjects = (await Subject.find({
      school: clientUser.school._id,
    })
      .select("school teacher name tasks")
      .select({ students: { $elemMatch: { $eq: clientUser._id } } })
      .lean()) as SubjectDoc[];
  }

  if (clientUser.schoolRole === "student") {
    subjects = subjects.filter(subject => subject.students?.length > 0);
  }

  const tasksIds: TaskDoc[] = [];
  subjects.forEach(subject => tasksIds.push(...subject.tasks));

  return (
    <Suspense
      fallback={
        <>
          <Filters
            status={
              !searchParams.status ? "on going" : searchParams.status === "all" ? "all" : "on going"
            }
            path={`/schools/${(clientUser.school as SchoolDoc).name}/tasks`}
          />
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Subject</TableHead>
                <TableHead className="text-center">Deadline</TableHead>
                <TableHead className="text-center">Task Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <RowSkeleton />
            </TableBody>
          </Table>
        </>
      }
    >
      <PageContent
        clientUser={clientUser}
        tasksIds={tasksIds.map(id => id.toString())}
        status={searchParams.status || ""}
      />
    </Suspense>
  );
};

export default AllTasksPage;
