import { KnowledgeCategory } from "@/components/KnowledgeBaseListView";
import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCategories(supabaseClient: SupabaseClient<Database>, organizationKey: string): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabaseClient.from("knowledge_categories").select("*").eq("org_key", organizationKey).neq("name", "");
  if (error) {
    throw error;
  }

  return data;
}

export async function createCategory(supabaseClient: SupabaseClient<Database>, organizationKey: string, name: string, description: string): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabaseClient.from("knowledge_categories").insert({ org_key: organizationKey, name, description }).select();
  if (error) {
    throw error;
  }

  return data;
}

export async function updateCategory(supabaseClient: SupabaseClient<Database>, organizationKey: string, categoryId: number, name: string, description: string): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabaseClient.from("knowledge_categories").update({ name, description })
    .eq("id", categoryId)
    .eq("org_key", organizationKey)
    .select();
  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCategory(supabaseClient: SupabaseClient<Database>, organizationKey: string, categoryId: number): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabaseClient.from("knowledge_categories").delete()
    .eq("id", categoryId)
    .eq("org_key", organizationKey)
    .select();

  if (error) {
    throw error;
  }

  return data;
}
