'use client';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import { LoginButton } from '../login/LoginForm';
import { useFormState } from 'react-dom';
import sendResetPasswordEmail from './actions';

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

export const ResetPasswordForm = () => {
  const [state, formAction] = useFormState(sendResetPasswordEmail, initialState)

  if (state.status === 200) {
    return (
      <Flex direction={`column`}>
        <Heading className="title" >비밀번호 재설정 요청이 완료되었습니다.</Heading>
        <Text size="2" className="my-1 font-thin">이메일로 전달된 비밀번호 재설정 링크를 확인해주세요.</Text>
        <LoginButton className='my-2'>로그인 페이지로 이동하기</LoginButton>
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
            {state?.errors}
          </p>
        </Flex>
        <LoginButton>비밀번호 재설정 하기</LoginButton>
      </form>
    </>
  );
}
