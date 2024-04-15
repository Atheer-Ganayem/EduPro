"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  status: "all" | "on going";
  path: string;
}

const Filters: React.FC<Props> = ({ status, path }) => {
  const [value, setValue] = useState<string>(status);
  const router = useRouter();

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    router.push(path + "?status=" + value);
  }

  return (
    <form className="flex gap-5" onSubmit={submitHandler}>
      <Select value={value} onValueChange={val => setValue(val)} name="status">
        <SelectTrigger className="w-[180px] bg-muted mb-10">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select task status</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="on going">On going</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default Filters;
