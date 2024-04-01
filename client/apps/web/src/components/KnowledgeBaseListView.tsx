"use client";
import { Organization } from "@/contexts/OrganizationContext";
import { Database } from "@/lib/database.types";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Cross2Icon,
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
  Select,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useState } from "react";
import KnowledgeBaseUpdateForm from "./KnowledgeBaseUpdateForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useMixpanel } from "@/contexts/MixpanelContext";

export type KnowledgeItem =
  Database["public"]["Tables"]["knowledge_base"]["Row"];
export type KnowledgeCategory =
  Database["public"]["Tables"]["knowledge_categories"]["Row"];
export type KnowledgeBaseListViewProps = {
  knowledgeItems: KnowledgeItem[];
  categories: KnowledgeCategory[];
  organization: Organization;
  callback?: () => void;
} & React.HTMLProps<HTMLDivElement>;

const KnowledgeBaseListView: React.FC<KnowledgeBaseListViewProps> = ({
  knowledgeItems,
  organization,
  categories,
  callback,
}) => {
  const supabase = createClientComponentClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] =
    useState<KnowledgeItem[]>(knowledgeItems);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">(
    "edit"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(null)

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  const mixpanel = useMixpanel();

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
      const updatedItems = [...knowledgeItems, payload.new as KnowledgeItem];
      setFilteredItems(updatedItems);
    }

    if (payload?.eventType === "UPDATE") {
      const updatedItems = knowledgeItems.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new as KnowledgeItem;
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
        (payload) => {
          console.log("Change received!", payload);
          handleKnowledgeBaseDataChange(payload);
        }
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
              {
                categories.length > 0 && (
                  <Select.Root
                    defaultValue={'카테고리'}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setFilteredItems(value ? knowledgeItems.filter((item) => item.category === value) : knowledgeItems);
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
                )
              }
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
              <Table.Row>
                <StyledColumnHeaderCell>Question</StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Answer</StyledColumnHeaderCell>
                <StyledColumnHeaderCell>Category</StyledColumnHeaderCell>
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
                <Table.Row key={item.id} className="text-gray-600">
                  <Table.RowHeaderCell width={300}>
                    {item.question}
                  </Table.RowHeaderCell>
                  <Table.Cell className="max-w-96">{item.answer}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
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
                categories={filteredItems
                  .map((item) => item.category)
                  .filter((item) => item !== "" && !!item)
                  .reduce((acc, cur) => {
                    if (acc.includes(cur)) {
                      return acc;
                    }
                    return [...acc, cur];
                  }, [])}
                onSubmit={() => {
                  // TODO: abridge this
                  setOpenDialog(false);
                  // TODO: trigger server fetch
                  callback();
                  openToast();
                  mixpanel.track(
                    `Knowledge Item ${dialogMode === "create"
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

const StyledColumnHeaderCell = ({ children }) => (
  <Table.ColumnHeaderCell className="font-semibold">
    {children}
  </Table.ColumnHeaderCell>
);

export default KnowledgeBaseListView;
