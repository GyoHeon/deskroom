import { ResetPasswordForm } from './ResetPasswordForm';
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

const ResetPasswordPage = () => {
  return (
    <Box className="h-screen">
      <Flex justify={`center`} align={`center`} height={`100%`} direction={`column`}>
        <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
        <ResetPasswordForm />
      </Flex>
    </Box>
    //<ResetPasswordComponent token={token as string} />
  );
}

export default ResetPasswordPage; 
