"use client";

import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import ErrorAlert from "../ui/ErrorAlert";
import { removeMaterial } from "@/utils/actions/add-edit-material";

interface Props {
  materialId: string;
  subjectId: string;
}

const RemoveButton: React.FC<Props> = ({ materialId, subjectId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function removeHandler() {
    setLoading(true);
    setError("");
    try {
      const result = await removeMaterial(materialId, subjectId);
      if (result.code === 201) {
        window.location.reload();
      } else if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }
    setLoading(false);
  }

  return (
    <div className="mt-5">
      {error && <ErrorAlert description={error} />}
      <Button type="button" variant="destructive" disabled={loading} onClick={removeHandler}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          <span className="flex">
            Delete Material <Trash className="ms-2" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default RemoveButton;
