import React from "react";
import { Skeleton } from "../ui/skeleton";

const GradesSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

export default GradesSkeleton;
