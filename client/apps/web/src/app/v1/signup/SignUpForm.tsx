'use client';
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Box, Grid, IconButton, Text } from "@radix-ui/themes";
import { useState } from "react";
import { SignUpStep } from "./SignUpStep";


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
        <SignUpStep
          step={step}
          index={0}
          numOfSteps={steps.length}
          title="먼저 업무용 이메일을 입력해주세요."
          inputs={[{ label: "이메일", placeholder: "example@email.com", type: "email", showLabel: false, name: "email" }]}
          onButtonClick={() => setStep(step_ => step_ + 1)}
        />
        <SignUpStep
          step={step}
          index={1}
          numOfSteps={steps.length}
          title="사용하실 비밀번호를 입력해 주세요."
          inputs={[
            { label: "password", placeholder: "비밀번호", type: "password", showLabel: false, name: "password" },
            { label: "password-confirm", placeholder: "비밀번호 확인", type: "password", showLabel: false, name: "password-confirm" }
          ]}
          onButtonClick={() => setStep(step_ => step_ + 1)}
        />
        <SignUpStep
          step={step}
          index={2}
          numOfSteps={steps.length}
          title="기업 또는 브랜드 이름을 입력해 주세요."
          subtitle="입력한 이름은 이후에 변경할 수 있어요."
          inputs={[{ label: "org-name", placeholder: "예. 데스크룸", type: "text", showLabel: false, name: "org-name" }]}
          onButtonClick={() => setStep(step_ => step_ + 1)}
        />
        <SignUpStep
          step={step}
          index={3}
          numOfSteps={steps.length}
          title="상담 채널에 대한 정보를 알려주세요."
          subtitle="정확한 답변 추천을 위한 자료로 활용됩니다."
          inputs={[
            { label: "상담 업무를 몇 명이 담당하시나요?", placeholder: "예. 3명", type: "text", showLabel: true, name: "num-of-consultants" },
            { label: "한 달에 몇 건 정도 문의가 들어오시나요?", placeholder: "예. 100", type: "text", showLabel: true, name: "num-of-customers" },
            { label: "현재 이용 중인 상담 채널을 ,(콤마)로 구분해 작성해주세요.", placeholder: "예. 카카오톡, 채널톡, 전화", type: "text", showLabel: true, name: "cx-channels" }
          ]}
          onButtonClick={() => setStep(step_ => step_ + 1)}
        />
        <SignUpStep
          step={step}
          index={4}
          numOfSteps={steps.length}
          title="가입하시는 담당자분의 이름을 입력해주세요."
          inputs={[{ label: "name", placeholder: "예. 박경호", type: "text", showLabel: false, name: "name" }]}
          bottomTextOverride={
            <Text className="my-2 w-64 text-center word-break">
              가입 완료를 클릭하시면 데스크룸의 {""}
              <Text color="gray" className="underline">
                <a href="https://docs.google.com/document/d/1sgYHlhR0Drgtir6HKYH9EGAu_Q3o9r5BGWbPxGNasa4/edit?usp=sharing">Terms of Service 및 Privacy Policy</a>
              </Text>에
              동의한 것으로 간주합니다.
            </Text>
          }
        />
      </form></>
  )
};

