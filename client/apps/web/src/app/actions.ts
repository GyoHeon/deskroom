"use server";

import { KnowledgeBase, PartialKnowledgeTag } from "@/lib/supabase.types";
import { createClient } from "@/utils/supabase/server";

export async function updateTags(
  knowledgeTags: PartialKnowledgeTag[],
  categoryID: number | null,
  knowledgeBaseID: number | null,
  organizationKey: string | null
) {
  const supabase = createClient();
  const { data: newTags, error } = await supabase
    .from("knowledge_tags")
    .upsert(
      knowledgeTags.map((tag) => ({
        id: tag?.id ?? undefined,
        name: tag.name,
        category_id: categoryID,
        question_id: knowledgeBaseID,
      })),
      {
        onConflict: "name,question_id,category_id",
        defaultToNull: false,
      }
    )
    .select();
  if (error) {
    console.error("Error creating new tags:", error);
    return; // TODO: add error
  }
  const { data: newTagsCategories, error: newTagsCategoriesError } =
    await supabase
      .from("tags_categories")
      .upsert(
        newTags.map((tag) => ({
          tag_id: tag.id,
          tag_name: tag.name,
          category_id: categoryID,
          updated_at: new Date().toISOString(),
        }))
      )
      .select();
  if (newTagsCategoriesError) {
    console.error("Error creating tags categories:", error);
    return; // TODO: add error
  }
  const { error: knowledgeBaseTagsError } = await supabase
    .from("knowledge_base_tags")
    .upsert(
      newTagsCategories.map((tagCategory) => ({
        knowledge_base_id: knowledgeBaseID,
        tag_id: tagCategory.id,
        tag_name: tagCategory.tag_name,
        org_key: organizationKey,
        updated_at: new Date().toISOString(),
      }))
    )
    .select();
  if (knowledgeBaseTagsError) {
    console.error("Error creating knowledge base tags:", error);
    return; // TODO: add error
  }
  return [newTags, newTagsCategories];
}

export async function updateKnowledgeBase(knowledgeItem: KnowledgeBase) {
  const supabase = createClient();
  const { data: updatedKnowledgeItem, error } = await supabase
    .from("knowledge_base")
    .upsert([
      {
        ...knowledgeItem,
        updated_at: new Date().toISOString(),
      },
    ])
    .select();
  if (error) {
    console.error("Error updating knowledge item:", error);
    return; // TODO: add error
  }
  return updatedKnowledgeItem;
}

export async function createKnowledgeBase(knowledgeItem: KnowledgeBase) {
  const supabase = createClient();
  const { data: newKnowledgeItem, error } = await supabase
    .from("knowledge_base")
    .insert([
      {
        ...knowledgeItem,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select();
  if (error) {
    console.error("Error creating knowledge item:", error);
    return; // TODO: add error
  }
  return newKnowledgeItem;
}
