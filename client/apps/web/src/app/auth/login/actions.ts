"use server";
import { LoginState } from "@/app/login/LoginForm";
import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Mixpanel from "mixpanel";

export async function signIn(prevState: LoginState, formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // check user is in organization
  if (error || !data?.user) {
    return {
      errors: error?.message || "Invalid email or password",
      status: 400,
    };
  }
  const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_API_KEY); // TODO: make this share through server requests

  mixpanel.track("Signed In", {
    distinct_id: data.user.id,
    email: data.user.email,
  });

  return {
    errors: null,
    status: 200,
  };
}
