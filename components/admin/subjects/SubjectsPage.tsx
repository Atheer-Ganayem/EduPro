import type { SchoolDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import SubjectsTable from "./SubjectsTable";
import AddSubjectDialog from "./addSubjectDialog";
import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Subject from "@/models/Subject";

interface Props {
  // subjects: SubjectDoc[];
  // students: UserDoc[];
  // teachers: UserDoc[];

  email: string;
}

const SubjectsPage: React.FC<Props> = async ({ email }) => {
  await connectDB();
  const user = (await User.findOne({ email })
    .select("-password")
    .populate({ path: "school", select: "subjects students teachers" })
    .lean()) as UserDoc;
  if (!user || user.schoolRole !== "admin") {
    redirect("/auth");
  }

  const subjects = (await Subject.find({ _id: (user.school as SchoolDoc).subjects })
    .populate({
      path: "teacher",
      select: "name",
    })
    .lean()) as SubjectDoc[];
  const students = (await User.find({ _id: (user.school as SchoolDoc).students })
    .select("name")
    .lean()) as UserDoc[];

  const teachersIds = (user.school as SchoolDoc).teachers.map(teacherInfo => teacherInfo.teacher);

  const teachers = (await User.find({ _id: teachersIds }).select("name")) as UserDoc[];

  return (
    <div className="flex justify-center items-end flex-col gap-10">
      <AddSubjectDialog students={students} teachers={teachers} />
      <SubjectsTable subjects={subjects} allStudents={students} allTeachers={teachers} />
    </div>
  );
};

export default SubjectsPage;
