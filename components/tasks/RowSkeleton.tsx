import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const RowSkeleton = () => {
  return (
    <>
      <TableRow className="text-center">
        <TableCell colSpan={5}>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
      <TableRow className="text-center">
        <TableCell colSpan={5}>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
      <TableRow className="text-center">
        <TableCell colSpan={5}>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowSkeleton;
