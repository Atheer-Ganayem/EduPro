import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Navbar showLinks={true} subjectsIds={[]} schoolRole="student" schoolName="" userId="" />
      <section className="landing">
        <main className="header flex-col lg:flex-row">
          <div>
            <div className="hero">
              <h1>EduPro fot next level Education</h1>
              <p>Manage your school subjects & tasks & students & teachers & more!</p>
            </div>
            <div className="flex justify-center gap-5 mt-10">
              <Button>
                <Link href="/auth">Create a New Account</Link>
              </Button>

              <Button variant="link">
                <Link href="/auth">Login</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <GraduationCap size={450} />
          </div>
        </main>
      </section>
    </>
  );
}
