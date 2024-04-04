'use client';
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";


type SignUpStepProps = {
  step: number;
  index: number
  numOfSteps: number;
  title: string;
  subtitle?: string;
  inputs: { label: string; placeholder: string; type: string, showLabel?: boolean, name: string }[];
  onButtonClick?: () => void;
  bottomTextOverride?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const SignUpStep: React.FC<SignUpStepProps> = ({ step, index, numOfSteps, title, subtitle, inputs, onButtonClick, bottomTextOverride }) => {
  const isEndStep = numOfSteps === index + 1;
  return (
    <Flex direction={`column`} gap={`4`} my={`4`} align={`center`} hidden={step !== index}>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <Box className="my-2 text-center">
        <Heading className="title">{title}</Heading>
        {subtitle && <Text size="2" className="my-[-12px] font-thin">{subtitle}</Text>}
      </Box>
      {
        inputs.map((input, inputIndex) => (
          <Flex className="form-group w-full" direction={`column`} key={inputIndex}>
            <label className={`font-bold ${!input.showLabel && 'sr-only'}`} htmlFor={input.label}>
              {input.label}
            </label>
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
              required
            />
          </Flex>
        ))
      }
      <ButtonWithLoading onClick={onButtonClick} shouldSubmit={isEndStep ? true : false}>{
        isEndStep ? "가입 완료" : "다음 단계로"
      }</ButtonWithLoading>
      {
        bottomTextOverride
          ? bottomTextOverride
          : <Text>
            이미 계정이 있으신가요? {" "}
            <Text color="gray" className="underline">
              <a href="/v1/login">로그인하기</a>
            </Text>
          </Text>
      }
    </Flex>
  );
}
