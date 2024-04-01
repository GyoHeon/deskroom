import DropzoneContextMenu from "@/components/DropzoneContextMenu";
import { Database } from "@/lib/database.types";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "../../components/TopNav";
import Spinner from "@/components/Spinner";

const getDuration = (createdTime: string) => {
  const createdDate = new Date(createdTime);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();
  const diffInMinutes = diff / (1000 * 60);
  return diffInMinutes;
};

export default async function UploadPage({ searchParams }) {
  // TODO: replace this with useOrganizationContext
  const orgKey = searchParams?.org;
  if (!orgKey) {
    console.error("No org key found");
    return;
  }
  const supabase = createServerComponentClient<Database>({
    cookies,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login");
  }

  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("*, users!inner(*)")
    .eq("users.id", session?.user.id);

  if (organizationError != null) {
    console.log(organizationError);
  }

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("key", orgKey)
    .single();

  if (error) {
    console.error("Error fetching organization:", error);
    return;
  }
  if (!organization) {
    console.error("Organization not found");
    return;
  }

  const {
    data: pendingUploadData,
    error: uploadError,
    count: pendingUploadCount,
  } = await supabase
    .from("uploads")
    .select("*", { count: "exact" })
    .eq("org_id", organization.id) // TODO: change org_id to org_key
    .eq("status", "PENDING");
  if (uploadError) {
    console.error("Error fetching uploads:", uploadError);
    return;
  }

  if (pendingUploadCount > 0) {
    return (
      <Flex direction={`column`}>
        <TopNav
          organizations={organizations}
          currentOrg={organization.name_kor}
        />
        <Container my={`4`}>
          <Heading my={`2`}>Upload</Heading>
          <Flex direction={`column`} gap={`4`}>
            <Box>
              <Spinner size={16} />
            </Box>
            <Text>
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
        </Container>
      </Flex>
    );
  }

  const { error: completedUploadError, count: completedUploadCount } =
    await supabase
      .from("uploads")
      .select("*", { count: "exact" })
      .eq("org_id", organization.key) // TODO: change org_id to org_key
      .eq("status", "SUCCESS");
  if (completedUploadCount) {
    console.error("Error fetching success uploads:", completedUploadError);
  }

  if (completedUploadCount > 0) {
    return (
      <Flex direction={`column`}>
        <TopNav
          organizations={organizations}
          currentOrg={organization.name_kor}
        />
        <Container my={`4`}>
          <Heading my={`2`}>Upload</Heading>
          <Flex direction={`column`} gap={`4`}>
            <Box>
              <Text>
                업로드가 완료되었습니다. 새로운 업로드를 시작하려면 아래 버튼을
                클릭하세요.
                {/* Uploads are completed. Click the button below to start a new upload. */}
              </Text>
            </Box>
            <Box>
              <DropzoneContextMenu />
            </Box>
          </Flex>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex direction={`column`}>
      <TopNav
        organizations={organizations}
        currentOrg={organization.name_kor}
      />
      <Container className="px-16 pt-4 bg-primary-100 min-h-[800px]">
        <Box className="rounded-xl bg-white p-5">
          <Heading my={`2`}>Upload</Heading>
          <Flex direction={`column`} gap={`4`}>
            <Flex direction={`column`}>
              <Text weight={`bold`}>스마트스토어를 이용하시는 경우</Text>
              <Text>
                010-5000-3473 번호로 스마트스토어 부관리자 권한을 부여해주세요.
              </Text>
              <Text>Knowledge Base 구축 후 이메일/연락처로 연락드립니다. </Text>
            </Flex>
            <Flex direction={`column`}>
              <Text weight={`bold`}>채널톡을 이용하시는 경우</Text>
              <Text>
                아래 첨부파일 항목에 대화 내역을 업로드해주시거나 kp@deskroom.so
                이메일로 채널톡 멤버로 초대해주세요.
              </Text>
              <Text>Knowledge Base 구축 후 이메일/연락처로 연락드립니다. </Text>
            </Flex>
            <Box>
              <Text weight={`bold`} my={`4`}>
                Upload a file
              </Text>
              <DropzoneContextMenu />
            </Box>
          </Flex>
        </Box>
      </Container>
    </Flex>
  );
}
