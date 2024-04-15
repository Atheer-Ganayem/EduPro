import MaterialsPage from "@/components/materials/MaterialsPage";
import TableSkeleton from "@/components/materials/TableSkeleton";
import User from "@/models/User";
import type { UserDoc } from "@/types/monggModels";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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

  return (
    <Suspense fallback={<TableSkeleton />}>
      <MaterialsPage clientUser={clientUser} subjectId={params.subjectId} />
    </Suspense>
  );
};

export default page;
