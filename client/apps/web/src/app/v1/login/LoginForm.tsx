'use client';

import { ButtonWithLoading } from "@/components/ButtonWithLoading";
import { Database } from "@/lib/database.types";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useFormState } from "react-dom";
import signIn from "./actions/signIn";

export type LoginState = {
  errors: string | null;
  status: number | null;
};

const initialState: LoginState = {
  errors: null,
  status: null,
}


const LoginForm = () => {
  const [state, formAction] = useFormState(signIn, initialState)
  const supabase = createClientComponentClient<Database>();
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (!!error) {
      console.error({ error })
      alert(`구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.\n${error.message}`)

      return
    }
  }

  return (
    <form action={formAction} method="POST" encType="multipart/form-data">
      <Flex direction={`column`} gap={`4`} my={`4`} className="w-96">
        <Flex className="form-group" direction={`column`}>
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
          <p aria-live="polite" className="sr-only">
            {state?.errors}
          </p>
        </Flex>
        <Flex className="form-group" direction={`column`}>
          <label className="font-bold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
          />
        </Flex>
        <p className="my-2 w-full h-4 text-red-600 font-bold" hidden={state?.errors === null}>
          {state?.errors}
        </p>
        <ButtonWithLoading >로그인</ButtonWithLoading>
        <IconButton type="button" className="w-full h-10 text-gray-900 shadow-md cursor-pointer" onClick={handleGoogleSignIn}>
          <Image src="/google-icon.svg" alt="home" width={14.5} height={14.5} className="mx-4 ml-[-9px]" />
          Continue with Google</IconButton>
        <Flex direction={`column`} align={`center`}>
          <Text>
            아직 계정이 없으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/signup">회원가입하기</a>
            </Text>
          </Text>
          <Text>
            비밀번호를 잊으셨나요?{" "}
            <Text color="gray" className="underline">
              <a href="/v1/reset-password">비밀번호 재설정</a>
            </Text>
          </Text>
        </Flex>
      </Flex>
    </form>
  )
}
export default LoginForm;
