'use client';
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import TopNav from "../../components/TopNav";
import { UploadInputGroup } from "./UploadInputGroup";
import Dropzone from "@/components/Dropzone";
import { useFormState } from "react-dom";
import upload from "./actions";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";
import { useOrganizationContext } from "@/contexts/OrganizationContext";

export type UploadStatus = {
  errors: { [key: string]: string } | null;
  status: number | null;
  message: string | null;
}

const initialState: UploadStatus = {
  errors: null,
  status: null,
  message: null
}


export const UploadForm = () => {
  const [state, formAction] = useFormState(upload, initialState)
  const { currentOrg } = useOrganizationContext();
  return (
    <Flex direction={`column`}>
      <TopNav />
      <Container className="px-16 py-4 bg-primary-100 min-h-[800px]">
        <form className="my-8" action={formAction} encType="multipart/form-data">
          <Box className="rounded-xl bg-white p-5">
            <Flex>
              <Box className="mb-2">
                <Heading>파일 업로드로 Q&A 등록하기</Heading>
                <Text as="p" className="text-sm">
                  고객 상담에 관련한 데이터를 업로드해주세요. 각 카테고리 별로 Q&A를 구축해 KMS에 등록해드립니다.
                </Text>
              </Box>
              <ButtonWithLoading className="ml-auto px-4 bg-secondary-900 w-32" shouldSubmit>Q&A 구축하기</ButtonWithLoading>
            </Flex>
            <Flex direction="column" gap="2">
              <UploadInputGroup
                label="카테고리 정보"
                description="현재 이용하고 계신 카테고리들을 콤마(,)로 구분해 입력해주세요. 입력해주신 카테고리를 반영해 Q&A를 정리합니다."
                placeholder="ex. 환불, 제품 이상, 서비스 장애"
                id="category"
                name="category"
                required
              />
              <UploadInputGroup
                label="필수 질문"
                description="Q&A에 꼭 포함되었으면 하는 질문들을 콤마(,)로 구분해 입력해주세요. 해당 질문은 필수로 포함해 Q&A를 정리합니다."
                placeholder="ex. 환불 정책이 어떻게 되나요?, 기능 이용 방법을 알려주세요, 제품이 정상 작동하지 않는데 어떻게하죠?"
                id="required-questions"
                name="required-questions"
                required
              />
              <UploadInputGroup
                label="Tone & Manner"
                description="희망하시는 답변의 어조나 어투들을 콤마 (,)로 구분해 입력해주세요. 입력해주신 내역을 기반으로 Q&A를 정리합니다."
                placeholder="ex. 답변의 시작은 “고객님”이라는 단어로 시작, 모든 문장의 끝은 ~다 로 끝내주세요"
                id="tone-manner"
                name="tone-manner"
              />
              <Flex direction={`column`}>
                <Text weight={`bold`}>
                  채널톡 대화 내역 업로드
                </Text>
                <Text>
                  채널톡 대화 내역을 업로드하시는 경우, 아래 창에 업로드해주세요.
                </Text>
                <Dropzone id="channel-talk-files" name="channel-talk-files" multiple />
                {state.errors?.channelTalkFiles && <Text className="text-red-500">{state.errors.channelTalkFiles}</Text>}
              </Flex>
              <Flex direction={`column`}>
                <Text weight={`bold`}>
                  기타 자료 업로드
                </Text>
                <Text>
                  상담 매뉴얼과 운영 가이드 등 Q&A 구축에 필요한 데이터를 업로드하시는 경우, 아래 창에 업로드해주세요.
                </Text>
                <Dropzone id="misc-files" name="misc-files" multiple />
                {state.errors?.miscFiles && <Text className="text-red-500">{state.errors.miscFiles}</Text>}
              </Flex>
              <Flex direction="column">
                <Text weight="bold">네이버 스마트스토어 및 카카오톡 채널 데이터
                </Text>
                <Text>
                  네이버 스마트스토어나 카카오톡 채널 데이터를 이용하실 경우, 네이버와 카카오의 정책 상 데이터 추출이 불가능합니다. {"\n"}
                </Text>
                <Text>
                  해당 가이드북을 따라 채널의 부관리자/매니저 권한을 부여해주시면, 데스크룸 팀이 데이터 수집 후 Q&A를 구축해드립니다.
                </Text>
              </Flex>
              <Flex>
                <input type="text" className="sr-only" id="org-key" name="org-key" value={currentOrg?.key} />
              </Flex>
            </Flex>
          </Box>
        </form>
      </Container>
    </Flex>
  )
}

