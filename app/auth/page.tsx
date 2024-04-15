import Tabs from "@/components/auth/tabs";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="container flex justify-center my-24">
      <Tabs />
    </div>
  );
};

export default page;
