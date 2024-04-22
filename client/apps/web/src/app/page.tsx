import { Box, Container, Flex } from "@radix-ui/themes";
import { revalidatePath } from "next/cache";
import KnowledgeBaseListView from "../components/KnowledgeBaseListView";
import TopNav from "../components/TopNav";
import { getCategories } from "@/app/lib/categories";
import { HotkeyProvider } from "@/contexts/HotkeyContext";
import { Sidebar } from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function NewIndex({ searchParams }) {
  const supabase = createClient();

  const { data: knowledgeBase, error: kbError } = await supabase
    .from("knowledge_base")
    .select(`
      *, 
      knowledge_tags (
        id,
        name
      ),
      knowledge_categories (
        id,
        name
      ),
      knowledge_images (
        file_name,
        image_url
      )
    `)
    .eq("org_key", searchParams.org);


  if (kbError) {
    console.error("Error fetching knowledge base:", kbError);
    return;
  }

  const handleDataChange = async () => {
    "use server";
    revalidatePath("/", "page"); // NOTE: NOT WORKING
  };

  const categories = await getCategories(supabase, searchParams.org);

  return (
    <HotkeyProvider categories={categories}>
      <Sidebar />
      <Flex direction={`column`} className="min-h-screen w-full">
        <TopNav />
        <Container className='px-16 pt-4 bg-primary-100'>
          <Box className="rounded-xl bg-white p-5">
            <KnowledgeBaseListView
              categories={categories}
              knowledgeItems={knowledgeBase as any[]} // TODO: fix type
              callback={handleDataChange}
            />
          </Box>
        </Container>
      </Flex>
    </HotkeyProvider>
  );
}
