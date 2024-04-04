'use client';
import { Box, Flex, Grid, Heading, IconButton, Text } from "@radix-ui/themes";
import { useState } from "react";
import Image from "next/image";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const steps = ["Email", "Password", "Company", "Misc", "Name"];
export const SignUpForm = () => {
  const [step, setStep] = useState(0)

  return (
    <>
      <Grid className="w-screen bg-gray-100 h-4 mb-auto" columns={steps.length.toString()}>
        {
          steps.map((_, index) => (
            <Box key={index} className={`h-4 ${step >= index + 1 ? 'bg-primary-900' : 'bg-gray-100'}`}></Box>
          ))
        }
      </Grid>
      <IconButton className="absolute top-0 left-0 m-4 my-8 bg-white text-gray-900 hover:bg-primary-100" onClick={() => setStep(s => s - 1)} hidden={step === 0}>
        <ArrowLeftIcon />
      </IconButton>
      <form className="flex-1 flex flex-col align-center justify-center">
        <Flex direction={`column`} gap={`4`} my={`4`} align={`center`} hidden={step !== 0}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">먼저 업무용 이메일을 입력해주세요.</Heading>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            className="p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10 w-full" />
          <ButtonWithLoading onClick={() => setStep(step_ => step_ + 1)} shouldSubmit={false}>다음 단계로</ButtonWithLoading>
          <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
        </Flex>
        <Flex direction={`column`} gap={`4`} my={`4`} align={`center`} hidden={step !== 1}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">사용하실 비밀번호를 입력해 주세요.</Heading>
          <Flex className="form-group w-full" direction={`column`}>
            <label className="font-bold" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <Flex className="form-group w-full" direction={`column`}>
            <label className="font-bold" htmlFor="password">
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              placeholder="Password"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <ButtonWithLoading onClick={() => setStep(step_ => step_ + 1)} shouldSubmit={false}>다음 단계로</ButtonWithLoading>
          <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
        </Flex>
        <Flex direction={`column`} my={`4`} align={`center`} hidden={step !== 2}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">기업 또는 브랜드 이름을 입력해 주세요.</Heading>
          <Text size="2" className="my-1 font-thin">입력한 이름은 이후에 변경할 수 있어요.</Text>
          <Flex className="form-group w-full my-4" direction={`column`}>
            <label className="font-bold" htmlFor="org-name">
              기업 또는 브랜드 이름
            </label>
            <input
              id="org-name"
              name="org-name"
              type="text"
              placeholder="예. 데스크룸"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <ButtonWithLoading onClick={() => setStep(step_ => step_ + 1)} shouldSubmit={false}>다음 단계로</ButtonWithLoading>
          <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
        </Flex>
        <Flex direction={`column`} gap={`2`} my={`4`} align={`center`} hidden={step !== 3}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">상담 채널에 대한 정보를 알려주세요.</Heading>
          <Text size="2" className="my-1 font-thin">정확한 답변 추천을 위한 자료로 활용됩니다. </Text>
          <Flex className="form-group w-full" direction={`column`}>
            <label className="font-bold" htmlFor="question-1">
              상담 업무를 몇 명이 담당하시나요?
            </label>
            <input
              id="question-1"
              name="question-1"
              type="text"
              placeholder="예. 3명"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <Flex className="form-group w-full" direction={`column`}>
            <label className="font-bold" htmlFor="question-2">
              한 달에 몇 건 정도 문의가 들어오시나요?
            </label>
            <input
              id="question-2"
              name="question-2"
              type="text"
              placeholder="예. 100"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <Flex className="form-group w-full" direction={`column`}>
            <label className="font-bold" htmlFor="question-3">
              현재 이용 중인 상담 채널을 ,(콤마)로 구분해 작성해주세요.
            </label>
            <input
              id="question-3"
              name="question-3"
              type="text"
              placeholder="예. 카카오톡, 채널톡, 전화"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <ButtonWithLoading onClick={() => setStep(step_ => step_ + 1)} shouldSubmit={false}>다음 단계로</ButtonWithLoading>
          <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
        </Flex>
        <Flex direction={`column`} gap={`2`} my={`4`} align={`center`} hidden={step !== 4}>
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
          <Heading className="title">가입하시는 담당자분의 이름을 입력해주세요.</Heading>
          <Flex className="form-group w-full" direction={`column`}>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="예. 박경호"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
          <ButtonWithLoading>가입 완료</ButtonWithLoading>
          <Text className="my-2 w-64 text-center word-break">
            계정 만들기를 클릭하시면 데스크룸의 {""}
            <Text color="gray" className="underline">
              <a href="/v1/login">Terms of Service 및 Privacy Policy</a>
            </Text>에
            동의한 것으로 간주합니다.
          </Text>
        </Flex>
      </form></>
  )
};

