'use server';

import { createClient } from "@/utils/supabase/server";

type SignUpState = {
  errors: string | null;
  status: number | null;
}

export async function signUp(prevState: SignUpState, formData: FormData) {
  const supabase = createClient()
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
  // TODO: extract to a function
  // TODO: move this after the user has been created
  const orgEngName = formData.get('org-eng-name') as string
  const orgKorName = formData.get('org-name') as string

  if (!orgEngName || !orgKorName) {
    return {
      errors: "조직명을 입력해주세요.",
      status: 400,
    }
  }

  const { data: existingOrganization, error: existingOrganizationError } = await supabase.from('organizations').select('*').eq('key', orgEngName).single()

  if (!existingOrganization && !!existingOrganizationError) {
    const { data: newOrganization, error: createOrganizationError } = await supabase.from('organizations').insert([{
      name_kor: orgKorName,
      name_eng: orgEngName,
      key: orgEngName,
    }]).select().single()
    if (!!createOrganizationError) {
      return {
        errors: createOrganizationError.message,
        status: 400,
      }
    }

    const { error: userOrganizationError } = await supabase.from('user_organizations').insert([{ user_id: data.user.id, org_id: newOrganization?.key }])

    if (!!userOrganizationError) {
      return {
        errors: userOrganizationError.message,
        status: 400,
      }
    }
  }


  const { error: userOrganizationError } = await supabase.from('user_organizations').insert([{ user_id: data.user.id, org_id: existingOrganization?.key }])

  if (!!userOrganizationError) {
    throw userOrganizationError
  }

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
