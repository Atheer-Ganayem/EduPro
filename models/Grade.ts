import mongoose, { models } from "mongoose";

const objectId = mongoose.Schema.Types.ObjectId;

const gradeSchema = new mongoose.Schema(
  {
    subject: { type: objectId, ref: "Subject", required: true },
    title: { type: String, required: true },
    maxGrade: { type: Number, required: true },
    grades: [
      {
        student: { type: objectId, ref: "User", required: true },
        grade: { type: Number, required: true },
      },
    ],
    avg: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models?.Grade || mongoose.model("Grade", gradeSchema);
