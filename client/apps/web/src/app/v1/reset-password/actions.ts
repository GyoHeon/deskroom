'use server';
import { ResetPasswordState } from "./ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";

export default async function sendResetPasswordEmail(prevState: any, formData: FormData): Promise<ResetPasswordState> {
  const email = String(formData.get('email'))

  if (!email) {
    return { errors: 'Email is required', status: 400, message: 'Email is required' }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_URL}/v1/reset-password/new?email=${formData.get('email')}` })
  if (!error) {
    return { errors: null, status: 200, message: '이메일이 발송되었습니다.' }

  }
  return { errors: error.name, status: error.status, message: error.message }
}
