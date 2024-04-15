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
import { CalendarIcon, Loader2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addTask } from "@/utils/actions/add-edit-task";

const formSchema = zod
  .object({
    title: zod.string().min(3),
    description: zod.string().optional(),
    required: zod.boolean().default(true),
    deadline: zod.date(),
  })
  .refine(
    data => {
      const today = new Date();
      const isToday =
        data.deadline.getDate() === today.getDate() &&
        data.deadline.getMonth() === today.getMonth() &&
        data.deadline.getFullYear() === today.getFullYear();

      return isToday ? true : data.deadline.getTime() - new Date().getTime() > 0;
    },
    {
      message: "The deadline cant be before today",
      path: ["deadline"],
    }
  );

const AddTaskForm: React.FC<{ subjectId: string }> = ({ subjectId }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      required: true,
      deadline: new Date(),
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      const values = form.getValues();
      console.log(values);

      const result = await addTask({ ...values, subjectId, description: values.description || "" });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHndler)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Subject's title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Subject's description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="required"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="flex items-end gap-5">
                <FormLabel>Required:</FormLabel>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="deadline"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {error && <ErrorAlert description={error} />}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Add Task"
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

export default AddTaskForm;
