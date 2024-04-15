import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Subject from "@/models/Subject";
import { GradeDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import AddGradeForm from "./AddGradeForm";
import { Student } from "@/types/other-types";
import Grade from "@/models/Grade";

interface Props {
  subjectId: string;
  mode: "add" | "edit";
  gradeId?: string;
  trigger?: React.ReactNode;
  initalMaxGrade?: number;
  initialTitle?: string;
}

const AddGradeDialog: React.FC<Props> = async ({
  subjectId,
  mode,
  trigger,
  gradeId,
  initalMaxGrade,
  initialTitle,
}) => {
  const students =
    mode === "add"
      ? (
          (
            (await Subject.findById(subjectId)
              .populate({
                path: "students",
                select: "name",
              })
              .lean()) as SubjectDoc
          ).students as UserDoc[]
        ).map(s => ({ ...s, grade: 0, _id: s._id.toString() }))
      : (
          (await Grade.findById(gradeId)
            .select("grades")
            .populate({
              path: "grades",
              populate: { path: "student", select: "name" },
            })) as GradeDoc
        ).grades.map(gr => ({
          _id: gr.student._id,
          name: (gr.student as UserDoc).name,
          grade: gr.grade,
        }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            Add a New Grade <Plus />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add a New Grade" : "Update Grade"}</DialogTitle>
          <DialogDescription>{mode === "add" && "Add a new Grade to the suject"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddGradeForm
            initialStudents={students as Student[]}
            mode={mode}
            subjectId={subjectId}
            initMaxGrade={initalMaxGrade}
            initialTitle={initialTitle}
            gradeId={gradeId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGradeDialog;
