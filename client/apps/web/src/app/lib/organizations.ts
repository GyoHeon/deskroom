import { createClient } from "@/utils/supabase/server";
import { Organization } from "@/lib/supabase.types";
import { SupabaseClient } from "@supabase/supabase-js";


export async function getAvailableOrganizations(supabase: SupabaseClient, userID: string | undefined): Promise<Organization[]> {
  if (!userID) {
    return [];
  }
  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("*, users!inner(id, email)")
    .eq("users.id", userID);

  if (organizationError != null) {
    throw organizationError;
  }

  if (!organizations || organizations.length === 0) {
    return [];
  }

  return organizations;
}
