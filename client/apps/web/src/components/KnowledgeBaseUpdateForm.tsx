"use client";
import { useMixpanel } from "@/contexts/MixpanelContext";
import { Organization } from "@/contexts/OrganizationContext";
import { Box, Button, Flex, Select, TextArea } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";
import { KnowledgeItem, KnowledgeItemQueryType } from "./KnowledgeBaseListView";
import Dropzone from "./Dropzone";

interface KnowledgeBaseUpdateFormProps {
  onSubmit: (data: KnowledgeItemQueryType) => void;
  selectedKnowledgeItem: KnowledgeItemQueryType | null;
  mode: "create" | "edit" | "delete";
  organization: Organization;
  categories: string[];
}

const KnowledgeBaseUpdateForm: React.FC<KnowledgeBaseUpdateFormProps> = ({
  onSubmit,
  selectedKnowledgeItem,
  mode,
  organization,
  categories,
}) => {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState<KnowledgeItemQueryType | null>(
    selectedKnowledgeItem
  );
  const mixpanel = useMixpanel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "delete") {
      const { error } = await supabase
        .from("knowledge_base")
        .delete()
        .match({ id: formData?.id })
        .returns();
      if (error) {
        console.error("Error deleting knowledge item:", error);
        return;
      }
      onSubmit(formData);
      return;
    }
    if (mode === "create") {
      const { data: newKnowledgeItem, error } = await supabase
        .from("knowledge_base")
        .insert([
          {
            ...formData,
            org_id: organization.id,
            org_name: organization.key,
            org_key: organization.key,
          },
        ])
        .select();
      if (error) {
        alert(`Error creating knowledge item: ${error}`);
        return;
      }
      setFormData(newKnowledgeItem[0]);
      onSubmit(formData);
      return;
    }

    const { data: updatedKnowledgeItem, error } = await supabase
      .from("knowledge_base")
      .upsert([formData])
      .select();
    if (error) {
      console.error("Error updating knowledge item:", error);
      return;
    }
    onSubmit(formData);
  };

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
    <form onSubmit={handleSubmit}>
      {mode === "delete" ? (
        <Box className="my-4 text-[13.5px] font-bold">
          {selectedKnowledgeItem.category && (
            <>[{selectedKnowledgeItem.category}] 카테고리에 있는</>
          )}
          [{selectedKnowledgeItem.question}] Q&A를 삭제하시겠습니까?
        </Box>
      ) : (
        <>
          <Flex direction={`column`} className="my-2">
            <label
              htmlFor="category"
              className="font-bold text-[11px]  pb-[5px]"
            >
              카테고리
            </label>
            <Select.Root
              size="3"
              defaultValue="카테고리"
              value={formData?.category ?? null}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <Select.Trigger className="w-[125px] h-[35px] px-2 rounded-lg bg-[#EFF1F999] text-sm shadow-none" />
              <Select.Content>
                <Select.Item value={null}>카테고리</Select.Item>
                {categories.map((category, categoryIdx) => (
                  <Select.Item key={categoryIdx} value={category}>
                    {category}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          <Flex direction={`column`} className="my-2">
            <label
              htmlFor="question"
              className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
            >
              질문
            </label>
            <input
              id="question"
              name="question"
              className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-gray-300 text-sm"
              value={formData?.question}
              onChange={handleChange}
            />
          </Flex>
          <Flex direction={`column`}>
            <label
              htmlFor="answer"
              className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
            >
              답변
            </label>
            <TextArea
              contentEditable
              rows={5}
              size={`3`}
              className="block p-2.5 w-full h-fit text-sm text-gray-900 rounded-lg border-gray-300 bg-[#EFF1F999] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 ring-0 static"
              placeholder="Write Answer..."
              id="answer"
              name="answer"
              value={formData?.answer}
              onChange={handleChange}
            />
          </Flex>
          <Flex direction={`column`} className="my-2">
            <label
              htmlFor="support_manual"
              className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
            >
              응답 매뉴얼
            </label>
            <input
              id="support_manual"
              name="support_manual"
              className="h-[35px] pl-2 rounded-md bg-[#EFF1F999] border-gray-300 text-sm"
              value={formData?.support_manual}
              onChange={handleChange}
            />
          </Flex>
          <Flex direction={`column`} className="my-2">
            <label
              htmlFor="files"
              className="text-violet11 font-bold text-[11px] leading-[18px] pb-[5px]"
            >
              첨부 파일
            </label>
            <Dropzone
              id="files"
              name="files"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
              questionId={formData?.id}
              existingFiles={formData?.knowledge_images}
            />
          </Flex>
          <Flex gap="2" className="gap-4">
            <Flex align="center" justify="center" gap="1" className="gap-2">
              <input type="checkbox" id="frequently_asked" name="frequently_asked" checked={formData?.frequently_asked ?? false} onChange={handleChange} className="w-4 h-4" />
              <label htmlFor="frequently_asked" className="text-violet11 text-sm leading-[18px]">자주 묻는 질문</label>
            </Flex>
            <Flex align="center" justify="center" gap="1" className="gap-2">
              <input type="checkbox" id="caution_required" name="caution_required" checked={formData?.caution_required ?? false} onChange={handleChange} className="w-4 h-4" />
              <label htmlFor="caution_required" className="text-violet11 text-sm leading-[18px]">답변 주의</label>
            </Flex>
          </Flex>
        </>
      )}

      <Flex justify={`end`} className="my-4">
        <Box width="9">
          <Button
            variant={`solid`}
            size={`3`}
            color={mode !== "delete" ? `violet` : `red`}
            className="p-2 rounded w-[100px] h-[35px] pl-2 bg-primary-900 text-white text-sm"
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
    </form>
  );
};

export default KnowledgeBaseUpdateForm;
