"use client";

import { ChevronsUpDown, Trash, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserDoc } from "@/types/monggModels";
import { Dispatch, SetStateAction, useState } from "react";
import { CommandList } from "cmdk";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

interface Props {
  students: UserDoc[];
  ids: string[];
  setIds: Dispatch<SetStateAction<string[]>>;
}

export const SelectStudents: React.FC<Props> = ({ students, ids, setIds }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>(
    students.filter(student => ids.includes(student._id)).map(student => student.name)
  );

  function selectHandler(selectedValue: string) {
    const selectedStudent = students.find(student => student._id.toString() === selectedValue);

    setIds(prev => [...prev, selectedValue]);
    setNames(prev => [...prev, selectedStudent!.name]);

    setOpen(false);
  }

  function removeHander(index: number) {
    setIds(prev => {
      prev.splice(index, 1);
      return prev;
    });
    setNames(prev => {
      prev.splice(index, 1);
      return prev;
    });
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full">
            Select students...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search students..." />
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {students
                  .filter(student => !ids.includes(student._id.toString()))
                  .map(student => (
                    <CommandItem key={student._id} value={student._id} onSelect={selectHandler}>
                      {student.name}
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {names.map((name, index) => (
        <h1 key={index}>
          {name}
          <Button
            className="p-0 h-fit w-fit bg-transparent hover:bg-transparent"
            onClick={() => removeHander(index)}
          >
            <Badge variant="destructive">
              <Trash2 size={16} />
            </Badge>
          </Button>
        </h1>
      ))}
    </>
  );
};
export default SelectStudents;
