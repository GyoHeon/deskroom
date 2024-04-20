import * as Dialog from "@radix-ui/react-dialog"
import { ClipboardIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Flex } from "@radix-ui/themes"

import "./styles.css"

const Manual = ({ manual, isCollapsed }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer">
          <ClipboardIcon color={isCollapsed ? "#C4C4C4" : "black"} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Flex className="flex justify-between mb-1">
            <Dialog.Title className="text-2xl font-semibold">매뉴얼</Dialog.Title>

            <Dialog.Close asChild>
              <button aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Flex>
          <Dialog.Description className="text-[13px] text-[#8b8d97]">
            상담을 진행하면서 참조할 매뉴얼 내용입니다.
          </Dialog.Description>

          <section className="mt-10">
            <h3 className="text-[11px] text-[#8b8d97]">응답 매뉴얼</h3>

            <p className="min-h-[225px] px-4 py-2 rounded-lg bg-[#EFF1F999] text-[#616161]">
              {manual}
            </p>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Manual
