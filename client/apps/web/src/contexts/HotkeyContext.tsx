"use client";

import { KnowledgeCategory } from "@/components/KnowledgeBaseListView";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Select, TextArea } from "@radix-ui/themes";
import { createContext, useContext, useState } from 'react';
import { useOrganizationContext } from "./OrganizationContext";
import CollapsibleCard from "@/components/CollapsibleCard";
import Skeleton from "@/components/Skeleton";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";

type Hotkey = {
  key: string;
  action: (e: React.KeyboardEvent) => void;
}
type HotkeyContextType = {
  hotkey: Hotkey[];
  setHotkey: () => void | null;
};
const hotkeyContext = createContext<HotkeyContextType | undefined>(undefined);

export const useHotkey = () => {
  const context = useContext(hotkeyContext);
  if (!context) {
    throw new Error('useHotkey must be used within a HotkeyProvider');
  }
  return context;
}
const cmdPlusK = (e: React.KeyboardEvent) => {
  return e.metaKey && e.key === 'k';
}

type HotkeyProviderProps = {
  categories: KnowledgeCategory[]
  children: React.ReactNode;
}
export const HotkeyProvider: React.FC<HotkeyProviderProps> = ({ children, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotkey, setHotkey] = useState<Hotkey[]>([{
    key: 'cmd+k',
    action: (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (cmdPlusK(e)) {
        setIsModalOpen(true);
      }
    }
  }]);
  // TODO: move this to other component
  const [formData, setFormData] = useState<{ category: string, answer?: string }>({ category: '' });
  const [answers, setAnswers] = useState<{ category: string, answer: string }[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentOrg } = useOrganizationContext();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`https://api.closer.so/v1/retrieve/`, {
      body: JSON.stringify({
        organization_key: currentOrg.key,
        question: formData?.answer,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .catch((err) => {
        alert("응답 생성에 실패했습니다. Error: " + err);
        setLoading(false);
        setAnswers(null);
      });
    setAnswers(res?.["retrieved_messages"] ?? null);
  }

  return (
    <hotkeyContext.Provider value={{ hotkey, setHotkey: () => { } }}>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay id="dialog-overlay" className="fixed blur-lg" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-inherit p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-scroll">
            <Dialog.Close className="absolute top-4 right-4">
              <Cross2Icon width={32} height={32} />
            </Dialog.Close>
            <Dialog.Title className="text-mauve12 text-[24px] font-medium">
              답변 추천받기
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 my-2 text-[15px] leading-normal">
              고객 질문을 그대로 붙여넣거나, 핵심적인 키워드만 입력하세요!
            </Dialog.Description>
            <form onSubmit={handleFormSubmit}>
              <Flex direction={`column`} className="my-2">
                <label
                  htmlFor="category"
                  className="font-bold text-[11px]  pb-[5px]"
                >
                  카테고리
                </label>
                <Select.Root
                  size="3"
                  defaultValue="apple"
                  value={formData?.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <Select.Trigger className="w-[125px] h-[35px] px-2 rounded-lg bg-[#EFF1F999] border-2" />
                  <Select.Content>
                    {categories.map((category, categoryIdx) => (
                      <Select.Item key={categoryIdx} value={category.name}>
                        {category.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Flex direction="column" className="my-2">
                <label
                  htmlFor="question"
                  className="font-bold text-[11px]  pb-[5px]"
                >
                  고객 질문
                </label>
                <TextArea
                  contentEditable
                  rows={1}
                  size={`1`}
                  className="block p-2.5 w-full h-fit text-sm text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-[#EFF1F999] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="예. 이거 환불 받고 싶어요."
                  id="answer"
                  name="answer"
                  value={formData?.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                />
              </Flex>
              <Flex>
                <ButtonWithLoading shouldSubmit className="w-[100px] h-[35px] text-white rounded-lg ml-auto">
                  추천받기
                </ButtonWithLoading>
              </Flex>
            </form>
            {loading && (
              <Flex
                className="sidebar-loading-area w-full h-full p-2"
                direction={`column`}
                align={`center`}
                justify={`center`}
              >
                <Box className="text text-[#7A7A7A] mt-2 text-xs">
                  가장 적절한 답변을 찾고 있어요.
                </Box>
                <Flex direction={`column`} className="w-full my-2" gap={`4`}>
                  <Skeleton />
                  <Skeleton delay={75} />
                  <Skeleton delay={100} />
                </Flex>
              </Flex>
            )}
            {(!!answers) && (
              <Flex
                className="sidebar-answer-view my-2 bg-[#F5F6F7] p-2 rounded-md"
                direction="column"
              >
                <Flex
                  className="text-sm text-[#7A7A7A]"
                  align={`center`}
                  justify={`center`}
                >
                  <Box className="font-bold text-xs">⚡ 추천 답변 ⚡</Box>
                </Flex>
                <Flex
                  direction={`column`}
                  gap={`2`}
                  align={`center`}
                  justify={`center`}
                  className="sidebar-answers w-full py-2"
                >
                  {answers.map((answer, answerIdx) => (
                    <CollapsibleCard
                      title={answer?.category || "일반"}
                      key={answerIdx}
                      content={answer?.answer}
                      onCopyClicked={() => {
                        alert("복사되었습니다.");
                      }}
                    />
                  ))}
                </Flex>
              </Flex>
            )}
            {
              answers === null && (
                <Flex
                  className="sidebar-answer-view my-2 bg-[#F5F6F7] p-2 rounded-md"
                  direction="column"
                >
                  <Flex
                    className="text-sm text-[#7A7A7A]"
                    align={`center`}
                    justify={`center`}
                  >
                    <Box className="font-bold text-xs">⚡ 추천 답변 ⚡</Box>
                  </Flex>
                  <Flex
                    direction={`column`}
                    gap={`2`}
                    align={`center`}
                    justify={`center`}
                    className="sidebar-answers w-full py-2"
                  >
                    <Box>추천할 답변이 없습니다.</Box>
                  </Flex>
                </Flex>

              )
            }
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Box onKeyDown={hotkey?.[0].action} className="flex">
        {children}
      </Box>
    </hotkeyContext.Provider>
  );
}
