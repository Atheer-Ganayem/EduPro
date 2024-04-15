"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Loader2, Paperclip, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ErrorAlert from "../ui/ErrorAlert";
import { submitTask } from "@/utils/actions/submit-task";
import { useParams } from "next/navigation";

const SubmitTask: React.FC<{ taskId: string }> = ({ taskId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<null | File[]>(null);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const params = useParams();

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

  async function submitHndler(e: React.FormEvent) {
    e.preventDefault();
    if (!files && !notes) {
      return setError("You must submit a file or a note or both");
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    if (files) {
      files.forEach(file => {
        formData.append("file", file);
      });
    }

    try {
      const result = await submitTask({
        formData: formData,
        notes,
        subjectId: params.subjectId as string,
        taskId,
      });

      if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }
    setLoading(false);
  }

  return (
    <form className="mt-16" onSubmit={submitHndler}>
      <input
        multiple
        onChange={e => chooseFileHandler(e.target.files)}
        ref={inputRef}
        hidden
        type="file"
        accept=".doc, .docx, .ppt, .pptx, .pdf, .xls, .xlsx, .jpg, .jpeg, .png, .gif, .bmp, .svg"
      />
      <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={8}
        placeholder="Notes..."
        className="bg-muted"
      />
      {error && (
        <div className="mt-5">
          <ErrorAlert description={error} />
        </div>
      )}
      <div className="flex gap-5 justify-end mt-10 ">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          <Paperclip />
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
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
    </form>
  );
};

export default SubmitTask;
