'use server';

import { createCategory, deleteCategory, updateCategory } from "@/app/api/categories";
import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function submitForm(prevData: any, formData: FormData) {
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookies(),
  });
  const orgKey = formData?.get('org_key') as string;
  const categoryID = parseInt(formData?.get('category-id') as string) as number
  const name = formData?.get('name') as string;
  const description = formData?.get('description') as string;

  try {
    switch (formData?.get('mode') as string) {
      case "create": {
        createCategory(supabase, orgKey, name, description); break;
      }
      case "edit": {
        updateCategory(supabase, orgKey, categoryID, name, description); break;
      }
      case "delete": {
        deleteCategory(supabase, orgKey, categoryID);
        break;
      }
      default: {
        throw new Error("Invalid mode");
      }
    }
  } catch (error) {
    return {
      errors: error.message,
      status: 400,
    }
  }
  revalidatePath('/categories', "page")
  return {
    errors: null,
    status: 200,
  }
}
