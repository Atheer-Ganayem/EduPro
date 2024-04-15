import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { File } from "lucide-react";
import { getIcon } from "@/utils/get-incon";
import DocsPreviewer from "./DocsPreviewer";

interface Props {
  studentName: string;
  note: string;
  files: string[];
}

const StudentSubmittedTaskData: React.FC<Props> = ({ studentName, note, files }) => {
  return (
    <Sheet>
      <SheetTrigger className="underline">{studentName}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{studentName}</SheetTitle>
          <SheetDescription>
            <div className="mt-5">
              <Textarea rows={8} value={note} disabled className="bg-muted mb-5" />
              {files.length > 0 && <DocsPreviewer files={files} />}
              {files.map((file, index) => (
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
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default StudentSubmittedTaskData;
