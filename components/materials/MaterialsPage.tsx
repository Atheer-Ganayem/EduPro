import Subject from "@/models/Subject";
import { SubjectDoc, UserDoc } from "@/types/monggModels";
import { notFound } from "next/navigation";
import React from "react";
import MaterialsTable from "./MaterialsTable";
import AddMaterialDialog from "./AddMaterialDialog";

interface Props {
  clientUser: UserDoc;
  subjectId: string;
}

const MaterialsPage: React.FC<Props> = async ({ clientUser, subjectId }) => {
  const subject = (await Subject.findById(subjectId).select(
    "students teacher school materials name"
  )) as SubjectDoc;
  if (!subject || subject.school.toString() !== clientUser.school.toString()) {
    notFound();
  } else if (clientUser.schoolRole === "student") {
    const student = subject.students.find(s => s.toString() === clientUser._id.toString());
    if (!student) {
      notFound();
    }
  } else if (
    clientUser.schoolRole === "teacher" &&
    subject.teacher.toString() !== clientUser._id.toString()
  ) {
    notFound();
  }

  return (
    <>
      {clientUser.schoolRole !== "student" && (
        <AddMaterialDialog subjectId={subject._id.toString()} />
      )}
      <MaterialsTable
        subjectName={subject.name}
        materials={subject.materials.reverse()}
        subjectId={subject._id.toString()}
      />
    </>
  );
};

export default MaterialsPage;
