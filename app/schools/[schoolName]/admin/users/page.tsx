import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import UsersPage from "@/components/admin/users/UsersPage";
import TableSkeleton from "@/components/admin/users/TableSkeleton";
import { authOptions } from "@/utils/authOptions";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersPage email={session.user.email} />
    </Suspense>
  );
};

export default page;
