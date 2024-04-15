"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DocViewer, {
  DocViewerRenderers,
  JPGRenderer,
  PNGRenderer,
  PDFRenderer,
} from "react-doc-viewer";
import { Button } from "../ui/button";

const DocsPreviewer: React.FC<{ files: string[] }> = ({ files }) => {
  const uris = files.map(file => ({
    uri: `${process.env.AWS}${file}`,
    fileType: file.split(".").pop(),
    fileName: file,
  }));

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="mb-5">Preview Files</Button>
      </SheetTrigger>
      <SheetContent className="lg:w-[50vw] lg:min-w-[50vw] w-full min-w-full">
        <DocViewer
          className="h-full"
          pluginRenderers={[JPGRenderer, PNGRenderer, ...DocViewerRenderers, PDFRenderer]}
          documents={uris}
        />
      </SheetContent>
    </Sheet>
  );
};

export default DocsPreviewer;
