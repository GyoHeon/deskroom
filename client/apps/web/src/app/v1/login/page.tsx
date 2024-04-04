import { Database } from "@/lib/database.types";
import { Box, Button, Card, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import Image from "next/image";

const LoginPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!!session) {
    console.error("User already logged in");
  }

  return (
    <Box style={{ height: "100vh" }}>
      <Flex justify={`center`} align={`center`} height={`100%`} direction={`column`}>
        <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
        <Heading className="title" >데스크룸에 오신 것을 환영합니다.</Heading>
        <Text size="2" className="my-1 font-thin">로그인 후 데스크룸을 시작하세요.</Text>
        <LoginForm />
      </Flex>
    </Box>
  );
};

export default LoginPage;
