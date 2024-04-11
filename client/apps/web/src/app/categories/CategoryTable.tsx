'use client';

import { KnowledgeCategory, StyledColumnHeaderCell } from "@/components/KnowledgeBaseListView";
import { Box, Button, Flex, Heading, IconButton, Table } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";
import { CategoryDialog } from "./CategoryDialog";

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

  return (
    <Box className="rounded-xl bg-white p-5">
      <Box className="mb-6">
        <Heading size="4" as="h1" className="font-semibold">
          카테고리 관리하기
        </Heading>
      </Box>
      <Flex className="mb-2">
        <Heading size="2" as="h3">
          Q&A 카테고리
        </Heading>
        <IconButton className="bg-secondary-900 ml-auto w-fit px-2 text-sm hover:bg-secondary-700"
          onClick={() => {
            setSelectedItem(null);
            setDialogMode("create");
            setOpenDialog(true);
          }}
        >
          <PlusIcon className="mx-1" />
          카테고리 추가하기
        </IconButton>
      </Flex>
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
        <CategoryDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          selectedItem={selectedItem}
          mode={dialogMode}
        />
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
