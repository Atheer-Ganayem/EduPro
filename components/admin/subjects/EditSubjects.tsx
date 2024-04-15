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
import SelectStudents from "./SelectStudents";
import { DialogClose } from "@/components/ui/dialog";
import { addSubject, editSubject } from "@/utils/actions/admin-add-edit-subject";
import { UserDoc } from "@/types/monggModels";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";

interface Props {
  students: UserDoc[];
  teachers: UserDoc[];
  initStudents: string[];
  initTeacherId: string;
  subjectName: string;
  subjectId: string;
}

const formSchema = zod.object({
  name: zod.string().min(3),
});

const EditSubject: React.FC<Props> = ({
  students,
  teachers,
  initStudents,
  initTeacherId,
  subjectName,
  subjectId,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [studentIds, setStudentIds] = useState<string[]>(initStudents);
  const [teacher, setTeacher] = useState<string>(initTeacherId);
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subjectName,
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      if (!teacher) {
        setLoading(false);
        return setError("Teacher is required");
      }
      const values = form.getValues();

      const result = await editSubject({
        name: values.name,
        students: studentIds,
        teacher: teacher,
        subjectId,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pen className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit subject: {subjectName}</DialogTitle>
          <DialogDescription>{"Edit subject's name, teacher and students."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHndler)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Subject's name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Select defaultValue={initTeacherId} onValueChange={val => setTeacher(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Teachers...</SelectLabel>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <SelectStudents students={students} ids={studentIds} setIds={setStudentIds} />
              {error && <ErrorAlert description={error} />}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <DialogClose asChild className="hidden">
                <Button ref={closeRef} type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubject;
