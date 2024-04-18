import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type KnowledgeImage = Tables["knowledge_images"]["Row"]
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];

export type PartialKnowledgeImage = Partial<KnowledgeImage>
export type PartialOrganization = Partial<Organization> 
