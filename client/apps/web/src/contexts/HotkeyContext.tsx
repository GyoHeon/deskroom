"use client";

import { KnowledgeCategory } from "@/components/KnowledgeBaseListView";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Flex, Select, TextArea } from "@radix-ui/themes";
import { createContext, useContext, useState } from 'react';

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
  return (
    <hotkeyContext.Provider value={{ hotkey, setHotkey: () => { } }}>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay id="dialog-overlay" className="fixed blur-lg" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[70vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-inherit p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Close className="absolute top-4 right-4">
              <Cross2Icon width={32} height={32} />
            </Dialog.Close>
            <Dialog.Title className="text-mauve12 text-[24px] font-medium">
              답변 추천받기
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 my-2 text-[15px] leading-normal">
              고객 질문을 그대로 붙여넣거나, 핵심적인 키워드만 입력하세요!
            </Dialog.Description>
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Box onKeyDown={hotkey?.[0].action}>
        {children}
      </Box>
    </hotkeyContext.Provider>
  );
}
