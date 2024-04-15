import mongoose, { models } from "mongoose";
require("./Task");

const objectId = mongoose.Schema.Types.ObjectId;

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: objectId, ref: "User", required: true },
  students: [{ type: objectId, ref: "User" }],
  school: { type: objectId, ref: "School", required: true },
  tasks: [{ type: objectId, ref: "Task" }],
  materials: [
    {
      title: { type: String },
      description: { type: String },
      files: [{ type: String }],
      createdAt: { type: Date },
    },
  ],
});

export default models?.Subject || mongoose.model("Subject", subjectSchema);
