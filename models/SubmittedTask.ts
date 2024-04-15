import mongoose, { models } from "mongoose";

const objectId = mongoose.Schema.Types.ObjectId;

const submittedTaskSchema = new mongoose.Schema(
  {
    student: { type: objectId, ref: "User", required: true },
    task: { type: objectId, ref: "Task", required: true },
    files: [{ type: String }],
    note: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models?.SubmittedTask || mongoose.model("SubmittedTask", submittedTaskSchema);
