import { Theme } from "@radix-ui/themes"
import * as _Sentry from "@sentry/react"
import type { User } from "@supabase/supabase-js"
import radixUIText from "data-text:@radix-ui/themes/styles.css"
import tailwindcssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import Sidebar from "~components/Sidebar"
import Tooltip from "~components/Tooltip"
import { DeskroomUserProvider } from "~contexts/DeskroomUserContext"
import { MixpanelProvider } from "~contexts/MixpanelContext"
import { useTextSelection } from "~hooks/useTextSelection"

import { version } from "../../package.json"

import "../style.css"

const Sentry = _Sentry

Sentry.init({
  dsn: process.env.PLASMO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `deskroom-extension@${version}`
})

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.plasmo.com/*",
    "https://desk.channel.io/*",
    "https://sell.smartstore.naver.com/*",
    "https://sell.smartstore.naver.com/#/home/about",
    "https://sell.smartstore.naver.com/#/talktalk/chat",
    "https://talk.sell.smartstore.naver.com/*",
    "https://mail.google.com/*",
    "https://www.thecloudgate.io/dashboard/*",
    "https://sbadmin01.sabangnet.co.kr/*",
    "https://artisit.idus.com/message/*",
    "https://admin.moji.cool/*",
    "https://mail.daum.net/*",
    "https://appstoreconnect.apple.com/apps/*",
    "https://play.google.com/store/apps/*",
    "https://dcamp.kr/admin/content/*",
    "https://business.kakao.com/dashboard/*",
    "https://center-pf.kakao.com/*",
    "https://workspace.gitple.io/*",
    "https://dcamp.kr/*",
    "https://play.google.com/*",
    "https://www.thecloudgate.io/*",
    "https://admin.dcamp.kr/*",
    "https://*.notion.site/*",
    "https://counselor.happytalk.io/*",
    "https://wing.coupang.com/*"
  ],
  run_at: "document_start",
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent += radixUIText
  style.textContent += tailwindcssText
  return style
}

function Content() {
  const [isOpen, setIsOpen] = useState(false)
  const [savedWidth, setSavedWidth] = useStorage<number>("sidebar-width")
  const [user] = useStorage<User>("user")
  const [question, setQuestion] = useState("")
  const { text, rects } = useTextSelection()

  const handleTooltipClick = () => {
    setIsOpen(true)
    if (text && rects.length > 0) {
      setQuestion(text)
    }
  }

  return (
    <MixpanelProvider
      token={process.env.PLASMO_PUBLIC_MIXPANEL_TOKEN}
      config={{
        debug: process.env.NODE_ENV !== "production",
        persistence: "localStorage"
      }}
      name={`deskroom-${process.env.NODE_ENV}`}>
      <DeskroomUserProvider>
        <Theme>
          <Sidebar
            isOpen={isOpen}
            setSidebarOpen={setIsOpen}
            question={question}
            setMessage={setQuestion}
            savedWidth={savedWidth}
            setSavedWidth={setSavedWidth}
          />
          <Tooltip clickHandler={handleTooltipClick} />
        </Theme>
      </DeskroomUserProvider>
    </MixpanelProvider>
  )
}

export default Sentry.withProfiler(Content)
