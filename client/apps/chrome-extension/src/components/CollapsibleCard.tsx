import { ClipboardIcon, CopyIcon, ImageIcon } from "@radix-ui/react-icons"
import { Box, Flex } from "@radix-ui/themes"
import React, { useState } from "react"

function copyToClipboard(content: string) {
  let copyFrom = document.createElement("textarea")
  copyFrom.textContent = content
  document.body.appendChild(copyFrom)
  copyFrom.select()
  document.execCommand("copy")
  copyFrom.blur()
  document.body.removeChild(copyFrom)
}

type CardProps = {
  title: string
  content: string
  supportManual: string | null
  frequentlyAsked: boolean | null
  cautionRequired: boolean | null
  supportImages: string[]
  onCopyClicked?: () => void
} & React.HTMLAttributes<HTMLDivElement>
const CollapsibleCard: React.FC<CardProps> = ({
  title,
  content,
  onCopyClicked,
  supportManual,
  frequentlyAsked,
  cautionRequired,
  supportImages,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const handleCopyClick = () => {
    onCopyClicked()
    copyToClipboard(content)
  }
  const handleMouseEnter = () => {
    setIsCollapsed(false)
  }
  return (
    <Box
      className="card w-full h-fit rounded-md shadow-md p-4 bg-white border border-1 border-white hover:border-[#2C2C2C] transition-all ease-in-out duration-75 hover:h-fit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsCollapsed(true)
      }}>
      <Flex className="card-header">
        <Flex className="flex gap-2 mr-auto">
          <Box className="category w-fit py-1 px-2 bg-primary-100 text-primary-700 font-bold rounded-sm text-sm">
            {title}
          </Box>
          {cautionRequired&& 
         <Box className="category w-fit py-1 px-2 bg-primary-900 text-primary-700 font-bold rounded-sm text-sm">
          답변 주의
          </Box> }
          {frequentlyAsked && 
         <Box className="category w-fit py-1 px-2 bg-primary-100 text-primary-900 border border-primary-900 font-bold rounded-sm text-sm">
          자주 쓰는 답변
          </Box> }
        </Flex>

        <Flex className="flex gap-2">
          {supportManual && (
            <Box className="cursor-pointer" onClick={handleCopyClick}>
              <ClipboardIcon color={isCollapsed ? "#C4C4C4" : "black"} />
            </Box>
          )}
          {supportImages.length > 0 && (
            <Box className="cursor-pointer" onClick={handleCopyClick}>
              <ImageIcon color={isCollapsed ? "#C4C4C4" : "black"} />
            </Box>
          )}
          <Box className="cursor-pointer" onClick={handleCopyClick}>
            <CopyIcon color={isCollapsed ? "#C4C4C4" : "black"} />
          </Box>
        </Flex>
      </Flex>
      <Flex className="card-content py-2">
        <p
          className={`select-text ${isCollapsed ? "line-clamp-3" : "line-clamp-none"}`}>
          {content}
        </p>
      </Flex>
    </Box>
  )
}

export default CollapsibleCard
