import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type KnowledgeImage = Tables["knowledge_images"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type KnowledgeTag =
  Database["public"]["Tables"]["knowledge_tags"]["Row"];
export type KnowledgeBase =
  Database["public"]["Tables"]["knowledge_base"]["Row"];

export type PartialKnowledgeImage = Partial<KnowledgeImage>;
export type PartialOrganization = Partial<Organization>;
export type PartialKnowledgeTag = Partial<KnowledgeTag>;
export type PartialKnowledgeBase = Partial<KnowledgeBase>;
