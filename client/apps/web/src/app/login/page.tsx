import LoginForm from "@/app/login/LoginForm";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginLogo from "./LoginLogo";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow py-10 px-16">
        <LoginLogo />
        <LoginForm />
      </div>
    </div>
  );
}
