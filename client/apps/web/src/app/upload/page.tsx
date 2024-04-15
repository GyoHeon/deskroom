import { Database } from "@/lib/database.types";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TopNav from "../../components/TopNav";
import Spinner from "@/components/Spinner";
import { UploadForm } from "./UploadForm";

const getDuration = (createdTime: string) => {
  const createdDate = new Date(createdTime);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();
  const diffInMinutes = diff / (1000 * 60);
  return diffInMinutes;
};

export default async function UploadPage({ searchParams }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: pendingUploadData,
    error: uploadError,
    count: pendingUploadCount,
  } = await supabase
    .from("uploads")
    .select("*", { count: "exact" })
    .eq("org_key", searchParams?.org) // TODO: change org_id to org_key
    .eq("status", "PENDING");

  if (uploadError) {
    return;
  }

  if (pendingUploadCount > 0) {
    return (
      <Flex direction={`column`} gap={`2`} align="center" justify="center">
        <Box className="my-8">
          <Spinner size={16} shouldSpin />
        </Box>
        <Text className="font-bold text-lg">
          진행 중인 업로드가 {pendingUploadCount}개 있습니다. 업로드가
          완료될 때까지 기다려주세요.
          {/* You have {pendingUploadCount} pending uploads. Please wait for the uploads to be processed. */}
        </Text>
        <Text>
          업로드가 완료되면 이 페이지를 새로고침 해주세요.
          {/* After the uploads are processed, please refresh this page. */}
        </Text>

        <Text>
          {Math.ceil(getDuration(pendingUploadData?.[0].created_at))}분 동안
          대기 중입니다.
          {/* Pending since {pendingUploadData?.[0].created_at} */}
        </Text>
      </Flex>
    );
  }

  const { error: completedUploadError, count: completedUploadCount } =
    await supabase
      .from("uploads")
      .select("*", { count: "exact" })
      .eq("org_key", searchParams?.org) // TODO: change org_id to org_key
      .eq("status", "SUCCESS");
  if (completedUploadCount) {
    console.error("Error fetching success uploads:", completedUploadError);
  }

  if (completedUploadCount > 0) {
    return (
      <Box>
        <Text>
          업로드가 완료되었습니다. 새로운 업로드를 시작하려면 아래 버튼을
          클릭하세요.
          {/* Uploads are completed. Click the button below to start a new upload. */}
        </Text>
      </Box>
    );
  }

  return (
    <UploadForm />
  );
}
