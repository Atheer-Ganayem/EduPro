import mongoose, { models } from "mongoose";
require("./School");

const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  school: {
    type: objectId,
    ref: "School",
  },
  schoolRole: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
});

export default models?.User || mongoose.model("User", userSchema);
