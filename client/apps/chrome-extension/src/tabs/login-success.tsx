import "../style.css"
import "data-text:@radix-ui/themes/styles.css"
import deskroomIcon from "data-base64:assets/icon.png"
import { Box, Button, Flex, IconButton, Separator, Heading, Text } from "@radix-ui/themes"

export default function LoginSuccess() {
  return (
    <main className="flex justify-center items-center w-screen h-screen flex-col">
      <img src={deskroomIcon} alt="Deskroom icon" width={40} height={40} />
      <Heading as={`h1`} className="text-2xl font-bold mt-4">
        로그인 되셨습니다!🎉
      </Heading>

      <Text className="mt-4">
        이 페이지는 닫으셔도 됩니다. 바로 상담 채널로 이동해 데스크룸을 이용해보세요!

        <Separator className="my-4" />
        브라우저에 데스크룸을 즐겨찾기 해두시면 더 편안하게 사용하실 수 있습니다.
      </Text>

    </main>
  )
}
