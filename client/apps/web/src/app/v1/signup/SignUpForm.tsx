'use client';
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import Image from "next/image";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";

const steps = ["Email", "Password", "Company", "Misc", "Name"];
export const SignUpForm = () => {
  const [step, setStep] = useState(0)

  return (
    <>
      <Grid className="w-screen bg-gray-100 h-4 mb-auto" columns={steps.length.toString()}>
        {
          steps.map((_, index) => (
            <Box key={index} className={`h-4 ${step === index + 1 ? 'bg-primary-900' : 'bg-gray-100'}`}></Box>
          ))
        }
      </Grid>
      <form>
        <Flex direction={`column`} gap={`4`} my={`4`} align={`center`}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">먼저 업무용 이메일을 입력해주세요.</Heading>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className="p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10 w-full" />
          <ButtonWithLoading onClick={() => setStep(step_ => step_ + 1)} shouldSubmit={false}>다음 단계로</ButtonWithLoading>
          <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
        </Flex>
      </form></>
  )
};

