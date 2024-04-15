'use client';

import { Database } from "@/lib/database.types";
import { Button, Flex } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
export async function markJobDone(jobID: number, supabase: SupabaseClient) {
  const { error } = await supabase.from('uploads').update({ status: 'DONE' }).eq('id', jobID)
  if (error) {
    console.error("Error marking job done", error)
    throw error
  }
}

export async function markJobFailed(jobID: number, supabase: SupabaseClient) {
  const { error } = await supabase.from('uploads').update({ status: 'DONE' }).eq('id', jobID)
  if (error) {
    console.error("Error marking job failed", error)
    throw error
  }
}

export async function deleteJob(jobID: number, supabase: SupabaseClient) {
  const { error } = await supabase.from('uploads').delete().eq('id', jobID)
  if (error) {
    console.error("Error deleting job", error)
    throw error
  }
}

type Job = Database["public"]["Tables"]["uploads"]["Row"]

export const JobActions = ({ job }: { job: Job }) => {
  const supabase = createClientComponentClient<Database>()
  return (
    <Flex className="col-span-4" gap="2" align="center" justify="end">
      <Button className="bg-primary-900" onClick={() => markJobDone(job.id, supabase)}>Done</Button>
      <Button className="bg-primary-900" onClick={() => markJobFailed(job.id, supabase)}>Fail</Button>
      <Button className="bg-primary-900" onClick={() => deleteJob(job.id, supabase)}>Delete</Button>
    </Flex>
  )
}
