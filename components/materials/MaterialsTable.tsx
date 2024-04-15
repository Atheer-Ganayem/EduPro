import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MaterialContentSheet from "./MaterialContentSheet";

interface Props {
  materials: {
    title: string;
    description: string;
    files: string[];
    _id: string;
    createdAt: Date;
  }[];
  subjectName: string;
  subjectId: string;
}

const MaterialsTable: React.FC<Props> = ({ materials, subjectName, subjectId }) => {
  return (
    <Table>
      <TableCaption>{"A list of all the subject's files"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Title</TableHead>
          <TableHead className="text-center">Description</TableHead>
          <TableHead className="text-center">Subject</TableHead>
          <TableHead className="text-center">Publication Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map(material => (
          <TableRow key={material._id}>
            <TableCell className="text-center">
              <MaterialContentSheet material={material} subjectId={subjectId} />
            </TableCell>
            <TableCell className="flex justify-center">
              <div
                className="w-[250px]"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {material.description}
              </div>
            </TableCell>
            <TableCell className="text-center">{subjectName}</TableCell>
            <TableCell className="text-center">{material.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialsTable;
