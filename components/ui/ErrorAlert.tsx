import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle } from "lucide-react";

const ErrorAlert: React.FC<{ description: string }> = ({ description }) => {
  return (
    <Alert variant="destructive" className="bg-red-500 bg-opacity-15 text-black dark:text-white">
      <AlertCircle className="h-4 w-4" color="red" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
