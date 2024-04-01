import { Database } from "@/lib/database.types";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import KnowledgeBaseListView from "../components/KnowledgeBaseListView";
import TopNav from "../components/TopNav";
import { getCategories } from "./api/categories";

export const revalidate = 0;

export default async function NewIndex({ searchParams }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  // TODO: https://supabase.com/blog/react-query-nextjs-app-router-cache-helpers
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login");
  }

  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("*, users!inner(*)")
    .eq("users.id", session?.user.id);

  if (organizationError != null) {
    console.log(organizationError);
  }

  // TODO: handle when org key changed in query param
  // TODO: handle case where user is not part of any organizations
  const orgKey = searchParams?.org;
  if (!orgKey) {
    console.error("No org key found");
    redirect(`/?org=${organizations[0].key}`);
  }
  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("key", orgKey)
    .single();

  if (error) {
    console.error("Error fetching organization:", error);
    return;
  }
  if (!organization) {
    console.error("Organization not found");
    return;
  }

  const { data: knowledgeBase, error: kbError } = await supabase
    .from("knowledge_base")
    .select("*")
    .eq("org_id", organization.id);
  if (kbError) {
    console.error("Error fetching knowledge base:", kbError);
    return;
  }

  const handleDataChange = async () => {
    "use server";
    revalidatePath("/", "page"); // NOTE: NOT WORKING
  };

  const { data: categories } = await getCategories(supabase, organization.key);

  return (
    <Flex direction={`column`} className="min-h-screen">
      <TopNav
        organizations={organizations}
        currentOrg={organization.name_kor}
      />
      <Container className='px-16 pt-4 bg-primary-100'>
        <Box className="rounded-xl bg-white p-5">
          <KnowledgeBaseListView
            categories={categories}
            knowledgeItems={knowledgeBase}
            organization={organization}
            callback={handleDataChange}
          />
        </Box>
      </Container>
    </Flex>
  );
}
