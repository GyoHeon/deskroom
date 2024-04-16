import { Database } from "@/lib/database.types";
import { Heading, Text } from "@radix-ui/themes";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { createClient } from "@/utils/supabase/server";

const LoginPage = async ({ sessionParams }) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!!session) {
    if (sessionParams?.from === "extension") {
      redirect('/v1/login/success')
    }
    redirect("/");
  }

  return (
    <>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <Heading className="title" >데스크룸에 오신 것을 환영합니다.</Heading>
      <Text size="2" className="my-1 font-thin">로그인 후 데스크룸을 시작하세요.</Text>
      <LoginForm />
    </>
  );
};

export default LoginPage;
