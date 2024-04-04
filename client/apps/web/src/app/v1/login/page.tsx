import { Database } from "@/lib/database.types";
import { Box, Button, Card, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
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
        <form className="form" action={`/auth/login`} method="post">
          <Flex direction={`column`} gap={`4`} my={`4`} className="w-96">
            <Flex className="form-group" direction={`column`}>
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              />
            </Flex>
            <Flex className="form-group" direction={`column`}>
              <label className="font-bold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              />
            </Flex>
            <Button type="submit" className="w-full bg-primary-900 h-10 cursor-pointer">로그인</Button>
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
      </Flex>
    </Box>
  );
};

export default LoginPage;
