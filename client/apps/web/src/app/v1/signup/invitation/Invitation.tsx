"use client";
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Invitation(searchParams: any) {
  const router = useRouter();
  const email = searchParams?.email;

  return (
    <Flex direction={`column`} gap={`4`} my={`4`} align={`center`}>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <Box className="my-2 text-center">
        <Heading className="title">계정 생성이 완료되었습니다!🎉</Heading>
        <Text size="2" className="my-[-12px] font-thin">로그인 후 데스크룸 이용을 시작해주세요!</Text>
      </Box>
      <Button onClick={() => router.push('/')} className="bg-primary-900 text-white rounded-md w-48">데스크룸 시작하기</Button>
    </Flex>
  );
}

