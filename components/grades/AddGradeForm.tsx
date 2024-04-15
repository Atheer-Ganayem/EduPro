"use client";

import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { Loader2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddGradeRow from "./AddGradeRow";
import { Student } from "@/types/other-types";
import { addGrade } from "@/utils/actions/add-edit-grade";

interface Props {
  initialStudents: Student[];
  mode: "add" | "edit";
  initMaxGrade?: number;
  subjectId: string;
  initialTitle?: string;
  gradeId?: string;
}

const formSchema = zod.object({
  name: zod.string().min(3),
  maxGrade: zod.preprocess(mg => parseInt(mg as string), zod.number().gt(0).lte(100)),
});

const AddGradeForm: React.FC<Props> = ({
  initialStudents,
  initMaxGrade,
  subjectId,
  initialTitle,
  gradeId,
  mode,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [maxGrade, setMaxGrade] = useState<number>(initMaxGrade || 100);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialTitle || "",
      maxGrade: initMaxGrade || 100,
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      const values = form.getValues();

      const convertedStudents = students.map(s => ({ student: s._id, grade: s.grade })) as {
        student: string;
        grade: number;
      }[];

      const result = await addGrade({
        title: values.name,
        maxGrade: values.maxGrade,
        students: convertedStudents,
        subjectId,
        gradeId,
      });
      if (result.code === 201) {
        closeRef.current!.click();
      } else if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }
    setLoading(false);
  }

  function updateStudentGradeHandler(studentId: string, newGrade: number) {
    setStudents(prev => {
      const index = prev.findIndex(student => student._id === studentId);
      const copy = [...prev];
      copy[index].grade = newGrade;

      return copy;
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHndler)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Grade Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Grade's name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="maxGrade"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Max Grade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Max possible grade"
                    type="number"
                    min={0}
                    max={100}
                    onChange={e => {
                      field.onChange(e);
                      setMaxGrade(parseInt(e.target.value) || 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Student's Name"}</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => {
              return (
                <AddGradeRow
                  maxGrade={maxGrade}
                  student={student}
                  key={student._id}
                  updateStudentGradeHandler={updateStudentGradeHandler}
                />
              );
            })}
          </TableBody>
        </Table>

        {error && <ErrorAlert description={error} />}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : mode === "add" ? (
            "Create a New Subject"
          ) : (
            "Update Subject"
          )}
        </Button>
        <DialogClose asChild className="hidden">
          <Button ref={closeRef} type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default AddGradeForm;
