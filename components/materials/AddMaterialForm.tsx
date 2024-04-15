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
import { Loader2, Paperclip, Trash } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { addMaterial } from "@/utils/actions/add-edit-material";
import { Badge } from "../ui/badge";

const formSchema = zod.object({
  title: zod.string().min(3),
  description: zod.string().optional(),
});

const AddMaterialForm: React.FC<{ subjectId: string }> = ({ subjectId }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<null | File[]>(null);
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    if (!files || files.length === 0) {
      return setError("every material must contain at least one file.");
    }
    try {
      const values = form.getValues();
      const formData = new FormData();
      if (files) {
        files.forEach(file => {
          formData.append("file", file);
        });
      }

      console.log({ ...values, files });

      const result = await addMaterial({
        title: values.title,
        description: values.description || "",
        formData,
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

  function chooseFileHandler(selectedFiles: FileList | null) {
    if (selectedFiles) {
      setFiles(prev => {
        let result;

        if (prev) {
          result = [...Array.from(prev), ...Array.from(selectedFiles)];
        } else {
          result = Array.from(selectedFiles);
        }

        return filterDuplicateFiles(result);
      });
    }
  }

  function removeHandler(index: number) {
    setFiles(prev => {
      if (!prev) {
        return [];
      }
      const copy = prev;

      copy.splice(index, 1);

      return [...copy];
    });
  }

  function filterDuplicateFiles(filesArray: File[]) {
    const result: File[] = [];

    filesArray.map(fileElem => {
      if (!includesFile(result, fileElem)) {
        result.push(fileElem);
      }
    });

    return result;
  }

  function includesFile(arr: File[], selectedFile: File) {
    const index = arr.findIndex(
      f =>
        f.name === selectedFile.name && f.size === selectedFile.size && f.type === selectedFile.type
    );

    return index === -1 ? false : true;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHndler)} className="space-y-4">
        <input
          multiple
          onChange={e => chooseFileHandler(e.target.files)}
          ref={inputRef}
          hidden
          type="file"
          accept=".doc, .docx, .ppt, .pptx, .pdf, .xls, .xlsx, .jpg, .jpeg, .png, .gif, .bmp, .svg"
        />
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Material's title" />
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
                  <Textarea rows={8} {...field} placeholder="Material's description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="space-x-3 space-y-3">
          {files?.map((file, index) => (
            <Badge variant="secondary" key={index}>
              <span>{file.name}</span>
              <Trash
                className="ms-3 text-red-500 cursor-pointer"
                size="20"
                onClickCapture={removeHandler.bind(null, index)}
              />
            </Badge>
          ))}
        </div>

        {error && <ErrorAlert description={error} />}
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          <Paperclip />
        </Button>
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

export default AddMaterialForm;
