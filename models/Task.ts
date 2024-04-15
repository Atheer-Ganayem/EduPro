import mongoose, { models } from "mongoose";

const objectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: { type: objectId, ref: "Subject", required: true },
    submittedTasks: [{ type: objectId, ref: "SubmittedTask" }],
    deadline: { type: Date, required: true },
    isRequired: { type: Boolean, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models?.Task || mongoose.model("Task", taskSchema);
