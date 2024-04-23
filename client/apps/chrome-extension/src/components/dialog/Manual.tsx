import { ClipboardIcon } from "@radix-ui/react-icons"

import makeManual from "~lib/popup/attachManualToHtml"
import openPopup from "~lib/popup/openPopup"

const Manual = ({ manual, isCollapsed }) => {
  if (!manual) {
    return <></>
  }

  const openManualPopup = openPopup({
    contentsRaw: makeManual(manual),
    title: "매뉴얼",
    description: "상담을 진행하면서 참조할 매뉴얼 내용입니다.",
    contentsTitle: "응답 매뉴얼"
  })

  return (
    <button onClick={openManualPopup}>
      <ClipboardIcon color={isCollapsed ? "#C4C4C4" : "black"} />
    </button>
  )
}

export default Manual
