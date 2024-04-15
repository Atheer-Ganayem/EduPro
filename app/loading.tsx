import { Loader2 } from "lucide-react";

const loading = () => {
  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <Loader2 className="mr-2 h-32 w-32 animate-spin " />
    </div>
  );
};

export default loading;
