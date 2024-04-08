'use client';
import { KnowledgeCategory } from "@/components/KnowledgeBaseListView";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, TextArea } from "@radix-ui/themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import submitForm from "./actions/mutate";

type CategoryDialogProps = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  mode: "create" | "edit" | "delete"
  selectedItem: KnowledgeCategory
}

type BaseState = {
  errors: string | null;
  status: number | null;
}
const initialState: BaseState = {
  errors: null,
  status: null,
}
type KnowledgeCategoryFormType = KnowledgeCategory & { mode?: "create" | "edit" | "delete", category_id?: number }

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onOpenChange, mode, selectedItem }) => {
  const [formData, setFormData] = useState<KnowledgeCategoryFormType | null>(null);
  const [state, formAction] = useFormState(submitForm, initialState)
  const { currentOrg } = useOrganizationContext();
  const [formKey, setFormKey] = useState<number>(0);
  const updateFormKey = () => { setFormKey(formKey + 1); setFormData(null) };

  useEffect(() => {
    if (!selectedItem) {
      setFormData(data => ({ ...data, org_key: currentOrg?.key, mode: mode }))
    }
  }, [open])

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (!!selectedItem) {
      setFormData(selectedItem)
    }
  }, [selectedItem])

  useEffect(() => {
    if (state.status === 200) {
      onOpenChange(false)
    }
  }, [state.status])


  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay id="dialog-overlay" className="fixed blur-lg" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-inherit p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Close className="absolute top-4 right-4">
            <Cross2Icon width={32} height={32} />
          </Dialog.Close>
          <Dialog.Title className="text-mauve12 text-[24px] font-medium">
            {mode === "create"
              ? "카테고리 추가하기"
              : mode === "edit"
                ? "카테고리 수정하기"
                : "카테고리 삭제하기"}
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 my-2 text-[15px] leading-normal">
            {["create", "edit"].includes(mode)
              ? "고객 상담에 추가할 카테고리를 작성해주세요."
              : "등록된 카테고리를 삭제합니다"}
          </Dialog.Description>
          <form action={formAction} onReset={updateFormKey}>
            <Flex direction={`column`} className="my-2">
              <label
                htmlFor="name"
                className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
              >
                카테고리명
              </label>
              <input
                id="name"
                name="name"
                className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-2 border-gray-300 text-[12px]"
                value={formData?.name}
                onChange={handleChange}
              />
            </Flex>
            <Box>
              <Flex direction={`column`}>
                <label
                  htmlFor="description"
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
                  id="description"
                  name="description"
                  value={formData?.description}
                  onChange={handleChange}
                />
              </Flex>
            </Box>
            <Flex direction={`column`} className="my-2 sr-only">
              <label
                htmlFor="org_key"
                className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
              >
                조직 키
              </label>
              <input
                id="org_key"
                name="org_key"
                className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-2 border-gray-300 text-[12px]"
                value={selectedItem?.org_key ?? formData?.org_key}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction={`column`} className="my-2 sr-only">
              <label
                htmlFor="mode"
                className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
              >
                모드
              </label>
              <input
                id="mode"
                name="mode"
                className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-2 border-gray-300 text-[12px]"
                value={mode}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction={`column`} className="my-2 sr-only">
              <label
                htmlFor="category-id"
                className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
              >
                카테고리 ID
              </label>
              <input
                id="category-id"
                name="category-id"
                className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-2 border-gray-300 text-[12px]"
                value={selectedItem?.id}
                onChange={handleChange}
              />
            </Flex>
            <Flex justify={`end`} className="my-4">
              <Box width="9">
                <Button
                  variant={`solid`}
                  size={`3`}
                  className="p-2 rounded w-[100px] h-[35px] pl-2 bg-primary-900 text-white"
                  type="submit"
                >
                  <Box className="px-1 text-sm">
                    {mode === "create"
                      ? "등록 하기"
                      : mode === "edit"
                        ? "수정 하기"
                        : "삭제 하기"}
                  </Box>
                </Button>
              </Box>
            </Flex>
            <p>
              {state.errors}
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
