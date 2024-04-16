import { supabase } from "~core/supabase"
import type { Database } from "~lib/database.types"

export type Organization = Pick<
  Database["public"]["Tables"]["organizations"]["Row"],
  "id" | "name_eng" | "name_kor" | "key"
>
export type OrganizationStorage = {
  availableOrgs: Organization[]
  currentOrg: Organization | undefined
}

export async function getOrgs(email: string): Promise<Organization[]> {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name_eng, name_kor, key, users!inner(*)")
  // .eq("users.email", email)

  if (error != null) {
    console.error(error)
  }
  for (const org of data) {
    delete org.users
  }
  return data
}

export async function getOrganizations(
  email: string | undefined
): Promise<OrganizationStorage> {
  if (!email) {
    throw new Error("User ID not found")
  }
  const organizations = await getOrgs(email)

  if (!organizations) {
    throw new Error("No organizations found for this user")
  }

  if (organizations.length === 0) {
    throw new Error("No organizations found for this user")
  }

  return {
    availableOrgs: organizations,
    currentOrg: organizations[0] // TODO: get from storage
  }
}
