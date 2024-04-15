import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeDoc, SubjectDoc, UserDoc } from "@/types/monggModels";
import { Button } from "../ui/button";
import { Triangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddGradeDialog from "./AddGradeDialog";

interface Props {
  grade: GradeDoc;
  schoolRole: "admin" | "teacher" | "student";
}

const GradeCard: React.FC<Props> = ({ grade, schoolRole }) => {
  return (
    <Card
      className={`flex text-center flex-col lg:flex-row items-center gap-4 bg-popover mb-10 hover:bg-muted duration-200`}
    >
      <CardHeader className="lg:w-4/12">
        <CardTitle>{grade.title}</CardTitle>
        <CardDescription>{grade.createdAt.toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardHeader className="lg:w-4/12">
        <CardTitle>{(grade.subject as SubjectDoc).name}</CardTitle>
        <CardDescription>{((grade.subject as SubjectDoc).teacher as UserDoc).name}</CardDescription>
      </CardHeader>
      <CardHeader className={schoolRole === "student" ? "lg:w-4/12" : "lg:w-3/12"}>
        <CardTitle className="flex gap-2 justify-center">
          <div>
            {schoolRole === "student" ? `${grade.grades[0].grade}/` : `Avrage: ${grade.avg}/`}
            <span className="font-normal">{grade.maxGrade}</span>
          </div>
          {schoolRole === "student" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Triangle
                    className={
                      grade.grades[0].grade >= grade.avg
                        ? "text-green-500"
                        : "text-red-500 rotate-180"
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {Math.abs(grade.avg - grade.grades[0].grade)}{" "}
                    {grade.grades[0].grade >= grade.avg
                      ? "Points greater than avrage"
                      : "Points lower than avrage"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        {schoolRole === "student" && (
          <CardDescription>{`Avrage: ${grade.avg}/${grade.maxGrade}`}</CardDescription>
        )}
      </CardHeader>
      {schoolRole !== "student" && (
        <CardFooter className="flex items-center p-0 pe-6 lg:w-1/12">
          <AddGradeDialog
            trigger={<Button>Details</Button>}
            subjectId={grade.subject._id.toString()}
            mode="edit"
            gradeId={grade._id.toString()}
            initalMaxGrade={grade.maxGrade}
            initialTitle={grade.title}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default GradeCard;
