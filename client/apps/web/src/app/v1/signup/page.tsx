import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SignUpForm } from "./SignUpForm";

const SignUpPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!!session) {
    console.error("User already logged in");
  }

  return (
    <SignUpForm />
  );
};

export default SignUpPage;
