'use client';
import { Flex } from '@radix-ui/themes';
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

  return (
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
  );
}
