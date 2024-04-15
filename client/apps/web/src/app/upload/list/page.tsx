import { Database } from "@/lib/database.types";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { JobStatusCircle, JobStatus } from "./JobStatusCircle";
import { JobActions } from "./JobActions";

const convertToReadableDate = (date: string) => {
  return new Date(date).toLocaleString();
}


export default async function UploadIndex({ searchParams }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: uploadJobs, error: uploadJobsError } = await supabase.from("uploads").select("*, users(email)").eq("org_key", searchParams?.org);
  return (
    <>
      <Heading>업로드 작업</Heading>
      <Text>현재 진행 중인 업로드 작업을 확인할 수 있습니다.</Text>
      <Flex direction="column" className="my-4 text-sm" gap="2">
        {uploadJobs.map((job) => (
          <Grid key={job.id} className="p-4 border border-gray-100 rounded-lg shadow-md shadow-secondary-100" columns="10" align="center" justify="center">
            <p className="col-span-1"><JobStatusCircle status={job.status as JobStatus} /></p>
            <Text className="col-span-2">{job.id}</Text>
            <Text className="col-span-2">{convertToReadableDate(job.created_at)}</Text>
            <Text className="col-span-1">{job.users.email}</Text>
            <JobActions job={job} />
          </Grid>
        ))}

      </Flex>
    </>
  )
}
