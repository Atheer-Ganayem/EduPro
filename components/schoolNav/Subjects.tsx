"use server";

import React from "react";
import { getNavSubjects } from "@/utils/actions/nav-actions";
import SubNavs from "./SubNavs";
import { NavLink } from "./NavLink";

interface Props {
  user: { schoolRole: "admin" | "student" | "teacher"; schoolName: string; _id: string };
  path: string;
  subjectsIds: string[];
}

const Subjects: React.FC<Props> = async ({ user, subjectsIds, path }) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const subjects = await getNavSubjects(user, subjectsIds);

  return (
    <>
      {subjects.map(subject => {

        return (
          <div key={subject._id}>
            <NavLink schoolName={user.schoolName} subject={subject} />
            <SubNavs schoolName={user.schoolName} subjectId={subject._id.toString()} />
          </div>
        );
      })}
    </>
  );
};

export default Subjects;
