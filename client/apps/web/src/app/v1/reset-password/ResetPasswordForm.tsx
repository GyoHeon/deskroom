'use client';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { ButtonWithLoading } from "@/components/ButtonWithLoading";
import { useFormState } from 'react-dom';
import sendResetPasswordEmail from './actions';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export type ResetPasswordState = {
  errors: string | null;
  status: number | null;
  message: string | null;
}
const initialState: ResetPasswordState = {
  errors: null,
  status: null,
  message: null,
}

export const ResetPasswordForm = async () => {
  const [state, formAction] = useFormState(sendResetPasswordEmail, initialState)
  const [isRecovery, setIsRecovery] = useState<boolean>(false)
  const supabase = createClientComponentClient<Database>();
  const router = useRouter()


  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setIsRecovery(true)
      }
    })

    if (isRecovery) {
      redirect("/v1/reset-password/new")
    }
  }, [])

  if (state.status === 200) {
    return (
      <Flex direction={`column`}>
        <Heading className="title" >비밀번호 재설정 요청이 완료되었습니다.</Heading>
        <Text size="2" className="my-1 font-thin">이메일로 전달된 비밀번호 재설정 링크를 확인해주세요.</Text>
        <ButtonWithLoading shouldSubmit={false} className='my-2' onClick={() => router.push("/v1/login")}>로그인 페이지로 이동하기</ButtonWithLoading>
      </Flex>
    )
  }

  return (
    <>
      <Heading className="title" >비밀번호를 잊으셨나요?</Heading>
      <Text size="2" className="my-1 font-thin">가입하신 이메일로 비밀번호를 재설정하실 수 있는 링크를 전달드리겠습니다.</Text>
      <form action={formAction}>
        <Flex direction={`column`} my={`4`} className="w-96">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
          />
          <p aria-live="polite" hidden={state.errors === null} className='font-bold text-red-500'>
            {state?.errors}: {state?.message}
          </p>
        </Flex>
        <ButtonWithLoading>비밀번호 재설정 하기</ButtonWithLoading>
      </form>
    </>
  );
}
