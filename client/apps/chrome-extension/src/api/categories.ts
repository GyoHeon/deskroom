import { supabase } from "~core/supabase"
import type { Category } from "~lib/database.types"

export type CategoryClient = Pick<
  Category,
  "id" | "org_key" | "name" | "description"
>
export type CategoryStorage = {
  availableCategories: CategoryClient[]
  currentCategory: CategoryClient | undefined
}

export async function getCategoriesFromSupabase(
  orgKey: string
): Promise<CategoryClient[]> {
  const { data, error } = await supabase
    .from("knowledge_categories")
    .select("id, org_key, name, description")
    .eq("org_key", orgKey)

  if (error !== null) {
    console.error(error)
  }

  return data || []
}

export async function getCategories(orgKey?: string): Promise<CategoryStorage> {
  if (!orgKey) {
    throw new Error("Organization not found")
  }

  const categories = await getCategoriesFromSupabase(orgKey)

  // 현재는 카테고리가 존재하지 않는 org가 있고 이는 정상적인 데이터임.
  const noCategories = !categories || categories?.length === 0

  if (noCategories) {
    return {
      availableCategories: [],
      currentCategory: undefined
    }
  }

  return {
    availableCategories: categories,
    currentCategory: categories[0] // TODO: get from storage
  }
}
