import GradesPage from "@/components/grades/GradesPage";
import GradesSkeleton from "@/components/grades/GradesSkeleton";
import Subject from "@/models/Subject";
import User from "@/models/User";
import { SubjectDoc, UserDoc } from "@/types/monggModels";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

const page: React.FC<{ params: { subjectId: string } }> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }
  const clientUser = (await User.findById(session.user.id).select("schoolRole school")) as UserDoc;
  if (!clientUser) {
    redirect("/auth");
  }

  const subject = (await Subject.findById(params.subjectId).select(
    "students teacher school"
  )) as SubjectDoc;
  if (!subject || subject.school.toString() !== clientUser.school.toString()) {
    notFound();
  } else if (clientUser.schoolRole === "student") {
    const student = subject.students.find(s => s.toString() === clientUser._id.toString());
    if (!student) {
      notFound();
    }
  } else if (
    clientUser.schoolRole === "teacher" &&
    subject.teacher.toString() !== clientUser._id.toString()
  ) {
    notFound();
  }

  return (
    <Suspense fallback={<GradesSkeleton />}>
      <GradesPage
        schoolRole={clientUser.schoolRole}
        userId={clientUser._id.toString()}
        subjectId={subject._id.toString()}
      />
    </Suspense>
  );
};

export default page;
