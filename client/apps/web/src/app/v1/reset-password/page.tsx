import { ResetPasswordForm } from './ResetPasswordForm';
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

const ResetPasswordPage = () => {
  return (
    <Box className="h-screen">
      <Flex justify={`center`} align={`center`} height={`100%`} direction={`column`}>
        <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
        <Heading className="title" >비밀번호를 잊으셨나요?</Heading>
        <Text size="2" className="my-1 font-thin">가입하신 이메일로 비밀번호를 재설정하실 수 있는 링크를 전달드리겠습니다.</Text>
        <ResetPasswordForm />
      </Flex>
    </Box>
    //<ResetPasswordComponent token={token as string} />
  );
}

export default ResetPasswordPage; 
