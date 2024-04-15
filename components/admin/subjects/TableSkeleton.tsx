import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const TableSkeleton = () => {
  return (
    <Table>
      <TableCaption>A list of all subjects in the school.</TableCaption>
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="text-center">ID</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">{"Teacher's name"}</TableHead>
          <TableHead className="text-center">Number of students</TableHead>
          <TableHead className="text-center">Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
