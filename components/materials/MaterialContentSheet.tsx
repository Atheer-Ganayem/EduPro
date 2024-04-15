import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DocsPreviewer from "../tasks/DocsPreviewer";
import { File, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { getIcon } from "@/utils/get-incon";
import Link from "next/link";
import { Button } from "../ui/button";
import RemoveButton from "./RemoveButton";

interface Props {
  material: {
    title: string;
    description: string;
    files: string[];
    _id: string;
    createdAt: Date;
  };
  subjectId: string;
}

const MaterialContentSheet: React.FC<Props> = ({ material, subjectId }) => {
  return (
    <Sheet>
      <SheetTrigger className="font-medium underline text-center">{material.title}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            {material.title}
            <p className="text-muted-foreground">{material.createdAt.toLocaleDateString()}</p>
          </SheetTitle>
          <SheetDescription>{material.description}</SheetDescription>
        </SheetHeader>
        <div className="mt-10">
          <DocsPreviewer files={material.files} />

          <div className="flex gap-3 flex-wrap">
            {material.files.map((file, index) => (
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
        </div>
        <RemoveButton materialId={material._id} subjectId={subjectId} />
      </SheetContent>
    </Sheet>
  );
};

export default MaterialContentSheet;
