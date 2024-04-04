'use client';

import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useFormState } from "react-dom";
import signIn from "./actions/signIn";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";

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
        <IconButton type="submit" className="w-full h-10 text-gray-900 shadow-md cursor-pointer">
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
