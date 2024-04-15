import Grade from "@/models/Grade";
import React from "react";
import AddGradeDialog from "./AddGradeDialog";
import { Types } from "mongoose";
import GradeCard from "./GradeCard";

interface Props {
  schoolRole: "student" | "teacher" | "admin";
  userId: string;
  subjectId: string;
}

const GradesPage: React.FC<Props> = async ({ schoolRole, userId, subjectId }) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const grades = await Grade.aggregate([
    {
      $match: { subject: new Types.ObjectId(subjectId) },
    },
    {
      $lookup: {
        from: "subjects", // The collection name for the Subject schema
        localField: "subject",
        foreignField: "_id",
        as: "subject", // Populate the subject field
      },
    },
    {
      $unwind: "$subject", // Convert subject array into object
    },
    {
      $lookup: {
        from: "users", // The collection name for the User schema
        localField: "subject.teacher",
        foreignField: "_id",
        as: "subject.teacher", // Populate the teacher field
      },
    },
    {
      $unwind: "$subject.teacher", // Convert teacher array into object
    },
    {
      $project: {
        title: 1,
        maxGrade: 1,
        createdAt: 1,
        grades: {
          $filter: {
            input: "$grades",
            as: "grade",
            cond: { $eq: ["$$grade.student", new Types.ObjectId(userId)] },
          },
        },
        subject: {
          _id: "$subject._id",
          name: "$subject.name",
          teacher: {
            _id: "$subject.teacher._id",
            name: "$subject.teacher.name",
          },
        },
        avg: 1,
      },
    },
  ]);

  // const grades =
  //   schoolRole === "student"
  //     ? Grade.find({ subject: subjectId }).select("avg createdAt maxGrade title")
  //     : // .select({ grades: { $elemMatch: { $eq: clientUser._id } } })
  //       [];

  return (
    <>
      <div className="text-end mb-10">
        {schoolRole !== "student" && <AddGradeDialog subjectId={subjectId} mode="add" />}
      </div>
      <div>
        {grades.map(grade => (
          <GradeCard key={grade._id.toString()} schoolRole={schoolRole} grade={grade} />
        ))}
      </div>
    </>
  );
};

export default GradesPage;
