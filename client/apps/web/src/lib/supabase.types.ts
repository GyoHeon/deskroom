import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
export type KnowledgeImage = Tables["knowledge_images"]["Row"]
export type PartialKnowledgeImage = Partial<KnowledgeImage>
