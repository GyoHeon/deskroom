'use client';

import { ButtonWithLoading } from "@/components/ButtonWithLoading"
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react"
import Image from 'next/image'
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordNewIndex = async () => {
  const [newPassword, setNewPassword] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDone, setDone] = useState(false);
  const supabase = createClientComponentClient()
  const code = searchParams.get('code')

  // if (!code) {
  //   alert('잘못된 요청입니다. 다시 시도해주세요.')
  //   router.push('/v1/login')
  // }
  //
  //
  // const { error } = await supabase.auth.exchangeCodeForSession(code)
  // if (!!error) {
  //   alert('잘못된 요청입니다. 다시 시도해주세요.')
  //   router.push('/v1/login')
  // }
  //
  console.log({ code })

  const handleChangePassword = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (!!error) {
      console.error({ error })
      alert(`비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.\n${error.message}`)

      return
    }
    setDone(true)
  }

  if (isDone) {
    return (
      <Flex direction={`column`} gap={`4`} my={`4`} align={`center`}>
        <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
        <Box className="my-2 text-center">
          <Heading className="title">비밀번호 변경이 완료됐습니다!🎉</Heading>
          <Text size="2" className="my-[-12px] font-thin">로그인 후 데스크룸 이용을 시작해주세요!</Text>
        </Box>
        <Button onClick={() => router.push('/')} className="bg-primary-900 text-white rounded-md w-48">데스크룸 시작하기</Button>
      </Flex>
    )
  }

  return (
    <form onSubmit={handleChangePassword}>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <Flex direction={`column`}>
        <Heading className="title" >비밀번호를 재설정 해주세요.</Heading>
        <Box className="my-2">
          <Flex className="form-group" direction={`column`}>
            <label className="font-bold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
            />
          </Flex>
          <Flex className="form-group" direction={`column`}>
            <label className="font-bold" htmlFor="password-confirm">
              Password
            </label>
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              placeholder="비밀번호 확인"
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow h-10"
            />
          </Flex>
        </Box>
        <ButtonWithLoading className='my-2' onClick={handleChangePassword}>제출하기</ButtonWithLoading>
      </Flex>
    </form>
  )
}
export default ResetPasswordNewIndex
