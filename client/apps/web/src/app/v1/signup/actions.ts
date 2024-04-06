'use server';

import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type SignUpState = {
  errors: string | null;
  status: number | null;
}

export async function signUp(prevState: SignUpState, formData: FormData) {
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookies(),
  });
  const { data, error } = await supabase.auth.signUp(
    {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          name: formData.get('name') as string,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/v1/signup/invitation?email=${formData.get('email')}` // TODO: redirect to invitation
      },
    }
  )
  // TODO: add user to organization

  if (error || !data?.user) {
    return {
      errors: error?.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
      status: 400,
    }
  }

  return {
    status: 200,
    errors: null,
  }

}
