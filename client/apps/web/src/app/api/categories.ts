import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCategories(supabaseClient: SupabaseClient, orgagnizationKey: string) {
  return await supabaseClient.from("knowledge_categories").select("*").eq("org_key", orgagnizationKey);
}

