import { KnowledgeCategory } from "@/components/KnowledgeBaseListView";
import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCategories(supabaseClient: SupabaseClient<Database>, orgagnizationKey: string): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabaseClient.from("knowledge_categories").select("*").eq("org_key", orgagnizationKey).neq("name", "");
  if (error) {
    throw error;
  }

  return data;
}

