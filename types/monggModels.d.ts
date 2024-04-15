import { Document, ObjectId, Types } from "mongoose";

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  school: ObjectId | SchoolDoc;
  schoolRole: "student" | "teacher" | "admin";
}

export interface SchoolDoc extends Document {
  name: string;
  teachers: Teacher[];
  students: ObjectId[] | UserDoc[];
  subjects: ObjectId[] | SubjectDoc[];
}

type Teacher = {
  teacher: ObjectId | UserDoc;
  role: "teacher" | "admin";
  _id?: ObjectId; // Array element id not the teacher id
};

export interface SubjectDoc extends Document {
  name: string;
  teacher: ObjectId | UserDoc | Types.ObjectId;
  students: ObjectId[] | UserDoc[] | string[];
  school: ObjectId | SchoolDoc;
  tasks: Types.ObjectId[] | Task[];
  materials: {
    title: string;
    description: string;
    files: string[];
    createdAt: Date;
    _id: string;
  }[];
}

export interface TaskDoc extends Document {
  title: string;
  description: string;
  subject: Types.ObjectId | SubjectDoc;
  submittedTasks: Types.ObjectId[] | SubmittedTasksDoc[];
  deadline: Date;
  isRequired: boolean;
}

export interface SubmittedTasksDoc extends Document {
  student: Types.ObjectId | UserDoc;
  task: Types.ObjectId | Task;
  files: string[];
  note: string;
}

export interface GradeDoc extends Document {
  subject: Types.ObjectId | SubjectDoc;
  title: string;
  maxGrade: number;
  grades: [
    {
      student: Types.ObjectId | UserDoc;
      grade: number;
    }
  ];
  avg: number;
  createdAt: Date;
}
