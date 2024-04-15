import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UploadFiles from "./SubmitTask";
import { SubmittedTasksDoc } from "@/types/monggModels";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { File } from "lucide-react";
import { getIcon } from "@/utils/get-incon";
import StudentsTable from "./StudentsTable";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import DocsPreviewer from "./DocsPreviewer";

interface Props {
  title: string;
  description: string;
  deadline: Date;
  taskId: string;
  clientUser: { schoolRole: "student" | "teacher" | "admin"; _id: string };
  submittedTask: SubmittedTasksDoc | null;
}

const TaskSheet: React.FC<Props> = async ({
  title,
  description,
  deadline,
  taskId,
  clientUser,
  submittedTask,
}) => {
  const today = new Date();
  const isToday =
    deadline.getDate() === today.getDate() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getFullYear() === today.getFullYear();
  const expired = isToday ? false : deadline.getTime() - today.getTime() < 0 ? true : false;

  return (
    <Sheet>
      <SheetTrigger className="underline font-bold">{title}</SheetTrigger>
      <SheetContent side="left" className="overflow-y-scroll  min-w-[30rem]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <p>{deadline.toDateString()}</p>
          <hr />
          <SheetDescription>
            {description.split("\n").map((line, index) =>
              line ? (
                <span className="block" key={index}>
                  {line}
                </span>
              ) : (
                <br key={index} />
              )
            )}
          </SheetDescription>
          <hr />
        </SheetHeader>
        {clientUser.schoolRole !== "student" && (
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl mt-10" />}>
            <StudentsTable taskId={taskId} />
          </Suspense>
        )}
        {clientUser.schoolRole === "student" && !expired && !submittedTask && (
          <UploadFiles taskId={taskId} />
        )}
        {submittedTask && (
          <div className="mt-5">
            <Textarea rows={8} value={submittedTask.note} disabled className="bg-muted mb-5" />
            {submittedTask.files.length > 0 && <DocsPreviewer files={submittedTask.files} />}
            {submittedTask.files.map((file, index) => (
              <Link target="_blank" href={`${process.env.AWS}${file}`} key={index}>
                <Badge>
                  {getIcon(file) ? (
                    <Image src={`/icons/${getIcon(file)}`} width={30} height={30} alt="word" />
                  ) : (
                    <File />
                  )}
                  {file}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
