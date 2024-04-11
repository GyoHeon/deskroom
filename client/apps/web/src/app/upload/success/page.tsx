import { Button, Flex } from "@radix-ui/themes";
import { Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

export default async function SuccessPage() {
  return (
    <Flex direction={`column`} align={`center`} justify={`center`}>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <Heading className="title" >파일이 정상적으로 등록되어 Q&A 구축을 시작합니다!</Heading>
      <Text size="2" className="my-1">영업일 기준 1-2일 내로 KMS에서 추가된 Q&A를 확인하실 수 있습니다.</Text>
      <Text size="2" className="my-1">Q&A 구축이 완료되면 메일로 알림을 드리고 있으니, 조금만 기다려주세요!</Text>
      <a href="/">
        <Button className="mt-8 bg-secondary-900 w-32" >KMS로 돌아가기</Button>
      </a>
    </Flex>
  )
}
