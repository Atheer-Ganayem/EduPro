import mongoose, { models } from "mongoose";

const objectId = mongoose.Schema.Types.ObjectId;

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  teachers: [
    {
      teacher: { type: objectId, ref: "User" },
      role: { type: String, enum: ["teacher", "admin"] },
    },
  ],
  students: [{ type: objectId, ref: "User" }],
  subjects: [{ type: objectId, ref: "Subject" }],
});

export default models?.School || mongoose.model("School", schoolSchema);
