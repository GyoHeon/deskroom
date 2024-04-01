import { Database } from "@/lib/database.types";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const LoginPage = async () => {
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
    <Box style={{ height: "100vh" }}>
      <Flex justify={`center`} align={`center`} height={`100%`}>
        <Card size={`5`} style={{ minWidth: "500px" }}>
          <Heading className="title">Deskroom Sign Up</Heading>
          <form className="form">
            <Flex direction={`column`} gap={`4`} my={`4`}>
              <Flex className="form-group" direction={`column`}>
                <label htmlFor="email" className="text-bold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
                />
              </Flex>
              <Flex className="form-group" direction={`column`}>
                <label className="text-bold" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
                />
              </Flex>
              <Flex className="form-group" direction={`column`}>
                <label className="text-bold" htmlFor="password-confirm">
                  Password Confirm
                </label>
                <input
                  id="password-confirm"
                  type="password-confirm"
                  placeholder="Enter your password again"
                  className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
                />
              </Flex>
              <Flex className="form-group" direction={`column`}>
                <label className="text-bold" htmlFor="organization">
                  Organization
                </label>
                <input
                  id="organization"
                  type="organization"
                  placeholder="Enter your organization"
                  className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
                />
              </Flex>
              <Button type="submit" formAction={`/auth/sign-up`}>
                Sign Up
              </Button>
              <Text>
                Already have an account?{" "}
                <Text color="violet">
                  <a href="/v1/login">Login here</a>{" "}
                </Text>
              </Text>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Box>
  );
};

export default LoginPage;
