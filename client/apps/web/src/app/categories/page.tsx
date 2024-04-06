import { Sidebar } from "@/components/Sidebar";
import { HotkeyProvider } from "@/contexts/HotkeyContext";
import { Box, Container, Flex } from "@radix-ui/themes";
import { getCategories } from "../api/categories";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";

const CategoriesPage = async ({ searchParams }) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  // TODO: https://supabase.com/blog/react-query-nextjs-app-router-cache-helpers
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/v1/login");
  }
  const orgKey = searchParams?.org;
  if (!orgKey) {
    redirect(`/v1/login`);
  }
  const { data: categories } = await getCategories(supabase, orgKey);

  return (
    <HotkeyProvider categories={categories}>
      <Sidebar />
      <Flex direction={`column`} className="min-h-screen w-full">
        <TopNav />
        <Container className='px-16 pt-4 bg-primary-100'>
          <Box className="rounded-xl bg-white p-5">
          </Box>
        </Container>
      </Flex>
    </HotkeyProvider>
  );
}
export default CategoriesPage;
