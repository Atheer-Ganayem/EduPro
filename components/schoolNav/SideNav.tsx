import Nav from "./Nav";

interface Props {
  subjects: string[];
  schoolRole: "admin" | "student" | "teacher";
  userId: string;
  schoolName: string;
}

const SideNav: React.FC<Props> = ({ subjects, schoolRole, userId, schoolName }) => {
  return (
    <>
      <Nav subjects={subjects} schoolRole={schoolRole} userId={userId} schoolName={schoolName} />
    </>
  );
};

export default SideNav;
