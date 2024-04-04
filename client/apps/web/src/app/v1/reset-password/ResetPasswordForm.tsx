import { Flex } from '@radix-ui/themes';
import { LoginButton } from '../login/LoginForm';

export const ResetPasswordForm = () => {
  return (
    <form>
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
      </Flex>
      <LoginButton>비밀번호 재설정 하기</LoginButton>
    </form>
  );
}
