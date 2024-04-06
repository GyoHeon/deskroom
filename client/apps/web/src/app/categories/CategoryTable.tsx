'use client';

import { KnowledgeCategory, StyledColumnHeaderCell } from "@/components/KnowledgeBaseListView";
import { Box, Button, Flex, Heading, Table, TextArea } from "@radix-ui/themes";
import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

type CategoryTableProps = {
  categories: KnowledgeCategory[]
}
const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeCategory | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">(
    "edit"
  );
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  const [formData, setFormData] = useState<KnowledgeCategory | null>(
    selectedItem
  );
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Box className="rounded-xl bg-white p-5">
      <Box className="mb-6">
        <Heading size="4" as="h1" className="font-semibold">
          카테고리 관리하기
        </Heading>
      </Box>
      <Toast.Provider>
        <Table.Root className="border-t-gray-200 border-y">
          <Table.Header>
            <Table.Row>
              <StyledColumnHeaderCell>Category</StyledColumnHeaderCell>
              <StyledColumnHeaderCell>Description</StyledColumnHeaderCell>
              <StyledColumnHeaderCell>Action</StyledColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body
            style={{
              //@ts-ignore radix UI에 존재하는 속성 override
              "--table-row-box-shadow": "none",
            }}
          >
            {categories.map((item) => (
              <Table.Row key={item.id} className="text-gray-600">
                <Table.RowHeaderCell width={300}>
                  {item.name}
                </Table.RowHeaderCell>
                <Table.Cell className="max-w-96">{item.description}</Table.Cell>
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
        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
          <Dialog.Portal>
            <Dialog.Overlay id="dialog-overlay" className="fixed blur-lg" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-inherit p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Close className="absolute top-4 right-4">
                <Cross2Icon width={32} height={32} />
              </Dialog.Close>
              <Dialog.Title className="text-mauve12 text-[24px] font-medium">
                {dialogMode === "create"
                  ? "카테고리 추가하기"
                  : dialogMode === "edit"
                    ? "카테고리 수정하기"
                    : "카테고리 삭제하기"}
              </Dialog.Title>
              <Dialog.Description className="text-mauve11 my-2 text-[15px] leading-normal">
                {["create", "edit"].includes(dialogMode)
                  ? "고객 상담에 추가할 카테고리를 작성해주세요."
                  : "등록된 카테고리를 삭제합니다"}
              </Dialog.Description>
              <form>
                <Flex direction={`column`} className="my-2">
                  <label
                    htmlFor="category-name"
                    className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
                  >
                    카테고리명
                  </label>
                  <input
                    id="category-name"
                    name="category-name"
                    className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-2 border-gray-300 text-[12px]"
                    value={formData?.name}
                    onChange={handleChange}
                  />
                </Flex>
                <Box>
                  <Flex direction={`column`}>
                    <label
                      htmlFor="answer"
                      className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
                    >
                      카테고리 설명
                    </label>
                    <TextArea
                      contentEditable
                      rows={5}
                      size={`3`}
                      className="block p-2.5 w-full h-fit text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write Answer..."
                      id="answer"
                      name="answer"
                      value={formData?.description}
                      onChange={handleChange}
                    />
                  </Flex>
                </Box>
                <Flex justify={`end`} className="my-4">
                  <Box width="9">
                    <Button
                      variant={`solid`}
                      size={`3`}
                      color={dialogMode !== "delete" ? `violet` : `red`}
                      className="p-2 rounded w-[100px] h-[35px] pl-2"
                    >
                      <Box className="px-1 text-sm">
                        {dialogMode === "create"
                          ? "등록 하기"
                          : dialogMode === "edit"
                            ? "수정 하기"
                            : "삭제 하기"}
                      </Box>
                    </Button>
                  </Box>
                </Flex>
              </form>
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
              카테고리 항목이 성공적으로 수정되었습니다.
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
    </Box >
  )
}
export default CategoryTable;
