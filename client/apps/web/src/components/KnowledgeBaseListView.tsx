"use client";

import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Database } from "@/lib/database.types";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ClipboardIcon,
  Cross2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Popover,
  Select,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useState } from "react";
import KnowledgeBaseUpdateForm from "./KnowledgeBaseUpdateForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useMixpanel } from "@/contexts/MixpanelContext";
import { KnowledgeImage, PartialKnowledgeImage } from "@/lib/supabase.types";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export type KnowledgeItem =
  Database["public"]["Tables"]["knowledge_base"]["Row"];
export type KnowledgeCategory =
  Database["public"]["Tables"]["knowledge_categories"]["Row"];
export type QuestionTag = Database["public"]["Tables"]["knowledge_tags"]["Row"];
type QuestionTagName = Pick<QuestionTag, "name" | "id">;
type KnowledgeCategoryName = Pick<KnowledgeCategory, "name" | "id">;
type QuestionImageURL = Pick<KnowledgeImage, "image_url" | "file_name">;
export type KnowledgeItemQueryType = KnowledgeItem & {
  knowledge_categories?: KnowledgeCategoryName;
  knowledge_tags?: Partial<QuestionTagName>[];
  knowledge_images?: QuestionImageURL[];
};

export type KnowledgeBaseListViewProps = {
  knowledgeItems: KnowledgeItemQueryType[];
  categories: KnowledgeCategory[];
  // organization: Organization;
  callback?: () => void;
} & React.HTMLProps<HTMLDivElement>;

type SupportManualProps = {
  supportManual?: string;
};
export const SupportManual: React.FC<SupportManualProps> = ({
  supportManual,
}) => {
  if (!supportManual) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="cursor-pointer">
        <Box className="p-1 hover:bg-secondary-100 rounded duration-300 transition-[background-color]">
          <ClipboardIcon
            className="text-gray-600 rounded w-fit"
            width={21}
            height={21}
          />
        </Box>
      </Popover.Trigger>
      <Popover.Content>
        <Box>{supportManual}</Box>
      </Popover.Content>
    </Popover.Root>
  );
};

export const FilesPopover: React.FC<{ files: PartialKnowledgeImage[] }> = ({
  files,
}) => {
  if (!files || files.length === 0) {
    return null;
  }
  const FileContent = ({ image_url }: { image_url?: string }) => {
    if (!image_url) {
      return null;
    }
    if (image_url.endsWith(".pdf")) {
      return <iframe src={image_url} className="file-pdf" />;
    }
    return <img src={image_url} className="file-img" />;
  };
  return (
    <Popover.Root>
      <Popover.Trigger className="cursor-pointer">
        <Box className="p-1 hover:bg-secondary-100 rounded duration-300 transition-[background-color]">
          <DownloadIcon
            className="text-gray-600 rounded w-fit"
            width={21}
            height={21}
          />
        </Box>
      </Popover.Trigger>
      <Popover.Content className="w-fit">
        <Flex direction="column" gap="2">
          {files.map((file, idx) => (
            <Box key={idx}>
              <Dialog.Root>
                <Dialog.Trigger>
                  <IconButton className="w-fit bg-white p-1 border-dashed border text-black hover:bg-secondary-100 transition-[background-color] duration-300 hover:border-solid hover:border-0 cursor-pointer">
                    <ExternalLinkIcon className="mr-2" />
                    {file.file_name}
                  </IconButton>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="min-w-16 w-fit flex items-center justify-center rounded top-2/4 left-2/4 fixed -translate-x-2/4 -translate-y-2/4">
                    <Flex direction="column" className="bg-white">
                      <Dialog.Close />
                      <FileContent image_url={file.image_url} />
                    </Flex>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </Box>
          ))}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

const KnowledgeBaseListView: React.FC<KnowledgeBaseListViewProps> = ({
  knowledgeItems,
  categories,
  callback,
}) => {
  const supabase = createClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] =
    useState<KnowledgeItemQueryType[]>(knowledgeItems);
  const [selectedItem, setSelectedItem] =
    useState<KnowledgeItemQueryType | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">(
    "edit"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(null);
  const [selectedTag, setSelectedTag] = useState<string>(null);

  const { currentOrg: organization } = useOrganizationContext();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  const mixpanel = useMixpanel();

  const tags = knowledgeItems
    .map((item) => item.knowledge_tags)
    .flat()
    .filter((tag) => !!tag?.name)
    .map((tag) => tag.name);

  const handleKnowledgeBaseDataChange = async (
    payload: RealtimePostgresChangesPayload<{
      [key: string]: any;
    }>
  ) => {
    if (payload?.eventType === "DELETE") {
      const updatedItems = knowledgeItems.filter(
        (item) => item.id !== payload.old.id
      );
      setFilteredItems(updatedItems);
    }

    if (payload?.eventType === "INSERT") {
      const updatedItems = [
        ...knowledgeItems,
        payload.new as KnowledgeItemQueryType,
      ];
      setFilteredItems(updatedItems);
    }

    if (payload?.eventType === "UPDATE") {
      const updatedItems = knowledgeItems.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new as KnowledgeItemQueryType;
        }
        return item;
      });
      setFilteredItems(updatedItems);
    }
  };

  React.useEffect(() => {
    const channels = supabase
      .channel("knowledge-base-all-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "knowledge_base" },
        handleKnowledgeBaseDataChange
      )
      .subscribe();

    return () => {
      clearTimeout(timerRef.current);
      channels.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (searchQuery === "") {
      setFilteredItems(knowledgeItems);
      return;
    }
    const filtered = knowledgeItems.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, knowledgeItems]);

  const openToast = () => {
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  };

  React.useEffect(() => {
    // console.debug({ filteredItems })
  }, [filteredItems]);

  if (!knowledgeItems) {
    return (
      <Container>
        <Flex direction={`column`}>
          <Image
            src="/deskroom-deactivated.png"
            alt="Error"
            width={100}
            height={100}
          />
          <Heading size="2" className="font-semibold">
            Q&A가 없습니다.
          </Heading>
        </Flex>
      </Container>
    );
  }

  return (
    <>
      <Toast.Provider>
        <Container>
          <Flex mb="4">
            <Heading size="3" className="font-semibold">
              Knowledge Base
            </Heading>
            <Flex ml={`auto`} gap="2">
              <TextField.Root className="text-primary-900 font-medium">
                <TextField.Slot>
                  <MagnifyingGlassIcon
                    height="24"
                    width="24"
                    className="text-primary-900"
                  />
                </TextField.Slot>
                <TextField.Input
                  placeholder="Question 검색"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      mixpanel.track("Knowledge Base Search", {
                        query: searchQuery,
                      });
                    }
                  }}
                />
              </TextField.Root>
              {categories.length > 0 && (
                <Select.Root
                  defaultValue={"카테고리"}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setFilteredItems(
                      value
                        ? knowledgeItems.filter(
                            (item) => item.category === value
                          )
                        : knowledgeItems
                    );
                  }}
                  value={selectedCategory}
                >
                  <Select.Trigger className="font-semibold w-32 max-w-48">
                    카테고리
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value={null}>카테고리</Select.Item>
                      {categories.map((category, categoryIdx) => (
                        <Select.Item key={categoryIdx} value={category.name}>
                          {category.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              )}
              {tags.length > 0 && (
                <Select.Root
                  defaultValue={"태그"}
                  onValueChange={(value) => {
                    setSelectedTag(value);
                    setFilteredItems(
                      value
                        ? knowledgeItems.filter((item) =>
                            item.knowledge_tags
                              .map((tag) => tag.name)
                              .includes(value)
                          )
                        : knowledgeItems
                    );
                  }}
                  value={selectedTag}
                >
                  <Select.Trigger className="font-semibold w-32 max-w-48">
                    태그
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value={null}>태그</Select.Item>
                      {tags.map((tag, tagIdx) => (
                        <Select.Item key={tagIdx} value={tag}>
                          {tag}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              )}
              <Button
                className="bg-primary-900 text-white hover:bg-violet-300 transition-colors duration-200 ease-in-out cursor-pointer rounded-md"
                onClick={() => {
                  setDialogMode("create");
                  setOpenDialog(true);
                  setSelectedItem(null);
                }}
              >
                <PlusIcon />
                <Box>질문 추가하기</Box>
              </Button>
              <Button
                className="bg-primary-900 text-white hover:bg-violet-300 transition-colors duration-200 ease-in-out cursor-pointer rounded-md"
                onClick={() => {
                  router.push(`/upload?org=${searchParams.get("org")}`);
                }}
              >
                <UploadIcon />
                파일 업로드
              </Button>
            </Flex>
          </Flex>
          <Table.Root className="border-t-gray-200 border-y">
            <Table.Header>
              <Table.Row align="center">
                <StyledColumnHeaderCell>Question</StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Category</StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Tag</StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Answer</StyledColumnHeaderCell>
                <StyledColumnHeaderCell className="text-center">
                  Guide
                </StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Action</StyledColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body
              style={{
                //@ts-ignore radix UI에 존재하는 속성 override
                "--table-row-box-shadow": "none",
              }}
            >
              {filteredItems.map((item) => (
                <Table.Row
                  key={item.id}
                  className="text-gray-600"
                  align="center"
                >
                  <Table.RowHeaderCell width={300}>
                    <Flex gap="1">
                      {item.frequently_asked && (
                        <Box className="bg-white border border-primary-900 text-primary-900 rounded w-fit px-1 text-[9px]">
                          자주 묻는 질문
                        </Box>
                      )}
                      {item.caution_required && (
                        <Box className="bg-primary-900 text-white rounded w-fit px-1 text-[9px]">
                          답변 주의
                        </Box>
                      )}
                    </Flex>
                    {item.question}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {categories?.find(
                      (category) => category.id === item.category_id
                    )?.name ?? item.category}
                    {/* TODO: find a better way */}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      {item?.knowledge_tags &&
                        item.knowledge_tags.map((tag, idx) => (
                          <Box
                            key={idx}
                            className="bg-primary-800 text-[11px] rounded text-white text-center px-2"
                          >
                            {tag.name}
                          </Box>
                        ))}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell className="max-w-96">{item.answer}</Table.Cell>
                  <Table.Cell className="max-w-96">
                    <Flex gap="2" align="center" justify="center">
                      <SupportManual supportManual={item?.support_manual} />
                      <FilesPopover files={item?.knowledge_images} />
                    </Flex>
                  </Table.Cell>
                  <Table.Cell className="w-52">
                    <Flex align={`center`} height={`100%`} gap={`2`}>
                      <Button
                        className="bg-gray-100 text-gray-500"
                        onClick={() => {
                          setSelectedItem(item);
                          setDialogMode("edit");
                          setOpenDialog(true);
                        }}
                      >
                        수정하기
                      </Button>
                      <Button
                        className="bg-gray-100 text-gray-500"
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenDialog(true);
                          setDialogMode("delete");
                        }}
                      >
                        삭제하기
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Container>
        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
          <Dialog.Portal>
            <Dialog.Overlay id="dialog-overlay" className="fixed blur-lg" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-inherit p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Close className="absolute top-4 right-4">
                <Cross2Icon width={32} height={32} />
              </Dialog.Close>
              <Dialog.Title className="text-mauve12 text-[24px] font-medium">
                {dialogMode === "create"
                  ? "Q&A 추가하기"
                  : dialogMode === "edit"
                  ? "Q&A 수정하기"
                  : "Q&A 삭제하기"}
              </Dialog.Title>
              <Dialog.Description className="text-mauve11 my-2 text-[15px] leading-normal">
                {["create", "edit"].includes(dialogMode)
                  ? "고객 상담에 추가할 Q&A를 작성해주세요."
                  : "등록된 Q&A를 삭제합니다"}
              </Dialog.Description>
              <KnowledgeBaseUpdateForm
                organization={organization}
                categories={categories}
                onSubmit={() => {
                  // TODO: abridge this
                  setOpenDialog(false);
                  // TODO: trigger server fetch
                  callback();
                  openToast();
                  mixpanel.track(
                    `Knowledge Item ${
                      dialogMode === "create"
                        ? "Added"
                        : dialogMode === "edit"
                        ? "Updated"
                        : "Deleted"
                    }`,
                    {
                      question: selectedItem?.question,
                    }
                  );
                }}
                selectedKnowledgeItem={selectedItem}
                mode={dialogMode}
                tags={tags}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Toast.Root
          className="bg-white rounded-md px-4 py-2 shadow-lg border border-gray-200 text-gray-700 text-[11px] font-medium leading-[18px]"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-[11px] text-gray-700">
            수정 완료
          </Toast.Title>
          <Toast.Description asChild>
            <p className="text-[11px] text-gray-700">
              Knowledge Base 항목이 성공적으로 수정되었습니다.
            </p>
          </Toast.Description>
          <Toast.Close>
            <Button variant="soft" size="1" className="my-2 text-[9px]">
              <Cross2Icon width={8} height={8} />
              닫기
            </Button>
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </Toast.Provider>
    </>
  );
};

export const StyledColumnHeaderCell = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Table.ColumnHeaderCell className={`font-semibold ${className}`}>
    {children}
  </Table.ColumnHeaderCell>
);

export default KnowledgeBaseListView;
