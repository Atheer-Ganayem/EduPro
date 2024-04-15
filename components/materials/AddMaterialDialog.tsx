import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddMaterialForm from "./AddMaterialForm";

interface Props {
  subjectId: string;
}

const AddMaterial: React.FC<Props> = ({ subjectId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="mb-10">
        <div className="text-end">
          <Button>
            Add Material <Plus />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <AddMaterialForm subjectId={subjectId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterial;
