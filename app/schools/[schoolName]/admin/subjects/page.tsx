import SubjectsPage from "@/components/admin/subjects/SubjectsPage";
import TableSkeleton from "@/components/admin/subjects/TableSkeleton";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const page: React.FC<{ params: { schoolName: string } }> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  return (
    <Suspense fallback={<TableSkeleton />}>
      <SubjectsPage email={session.user.email} />
    </Suspense>
  );
};

export default page;
