'use server';
import { ResetPasswordState } from "./ResetPasswordForm"

export default async function sendResetPasswordEmail(prevState: any, formData: FormData): Promise<ResetPasswordState> {
  return { errors: "Not implemented", status: 501, message: "아직 구현되지 않은 기능입니다." }
  // TODO: Implement
  const response = await fetch('/api/v1/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (response.ok) {
    return { errors: null, status: response.status, message: data.message }
  }
  return { errors: data.error, status: response.status, message: data.message }
}
