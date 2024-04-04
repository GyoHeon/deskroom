'use server'

import { LoginState } from '@/app/v1/login/LoginForm'
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export default async function signIn(prevState: LoginState, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // check user is in organization
  if (error || !data?.user) {
    return {
      errors: error?.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
      status: 400,
    };
  }

  // Mutate data
  return {
    errors: null,
    status: 200,
  }
}
