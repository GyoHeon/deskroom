import { Database } from "@/lib/database.types";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { SignUpForm } from "./SignUpForm";

const SignUpPage = async () => {
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
    <>
      <SignUpForm />
    </>
  );
};

export default SignUpPage;
