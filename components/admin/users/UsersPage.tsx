import React from "react";

import UsersTable from "./UsersTable";
import AddUserDialog from "./AddUserDialog";

const UsersPage: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="flex justify-center items-end flex-col gap-10">
      <AddUserDialog />
      <UsersTable email={email} />
    </div>
  );
};

export default UsersPage;
