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
      <TableCaption>{"A list of all the subject's files"}</TableCaption>
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="text-center">Title</TableHead>
          <TableHead className="text-center">Description</TableHead>
          <TableHead className="text-center">Subject</TableHead>
          <TableHead className="text-center">Publication Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="text-center">
          <TableCell colSpan={4}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        </TableRow>
        <TableRow className="text-center">
          <TableCell colSpan={4}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        </TableRow>
        <TableRow className="text-center">
          <TableCell colSpan={4}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
