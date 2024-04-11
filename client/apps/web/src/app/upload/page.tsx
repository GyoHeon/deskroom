import DropzoneContextMenu from "@/components/DropzoneContextMenu";
import { Database } from "@/lib/database.types";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "../../components/TopNav";
import Spinner from "@/components/Spinner";
import { UploadInputGroup } from "./UploadInputGroup";

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
        <TopNav />
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
        <TopNav />
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
      <TopNav />
      <Container className="px-16 pt-4 bg-primary-100 min-h-[800px]">
        <Box className="rounded-xl bg-white p-5">
          <Box className="mb-2">
            <Heading>파일 업로드로 Q&A 등록하기</Heading>
            <Text as="p" className="font-thin text-sm">
              고객 상담에 관련한 데이터를 업로드해주세요. 각 카테고리 별로 Q&A를 구축해 KMS에 등록해드립니다.
            </Text>
          </Box>
          <form className="my-2">
            <UploadInputGroup
              label="카테고리 정보"
              description="현재 이용하고 계신 카테고리들을 콤마(,)로 구분해 입력해주세요. 입력해주신 카테고리를 반영해 Q&A를 정리합니다."
              placeholder="ex. 환불, 제품 이상, 서비스 장애"
              id="category"
              name="category"
            />
            <UploadInputGroup
              label="필수 질문"
              description="Q&A에 꼭 포함되었으면 하는 질문들을 콤마(,)로 구분해 입력해주세요. 해당 질문은 필수로 포함해 Q&A를 정리합니다."
              placeholder="ex. 환불 정책이 어떻게 되나요?, 기능 이용 방법을 알려주세요, 제품이 정상 작동하지 않는데 어떻게하죠?"
              id="required-questions"
              name="required-questions"
            />
            <UploadInputGroup
              label="Tone & Manner"
              description="희망하시는 답변의 어조나 어투들을 콤마 (,)로 구분해 입력해주세요. 입력해주신 내역을 기반으로 Q&A를 정리합니다."
              placeholder="ex. 답변의 시작은 “고객님”이라는 단어로 시작, 모든 문장의 끝은 ~다 로 끝내주세요"
              id="tone-manner"
              name="tone-manner"
            />
            <Flex direction={`column`} gap={`4`}>
              <Box>
                <Text weight={`bold`} my={`4`}>
                  Upload a file
                </Text>
                <DropzoneContextMenu />
              </Box>
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  );
}
