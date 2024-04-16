import type { User } from "@supabase/supabase-js"
import deskroomLogo from "data-base64:assets/logo.png"

import "./style.css"
import "data-text:@radix-ui/themes/styles.css"

import { ArrowTopRightIcon, GearIcon } from "@radix-ui/react-icons"
import { Box, Button, Flex, IconButton, Separator } from "@radix-ui/themes"
import * as _Sentry from "@sentry/react"
import browser from "webextension-polyfill"

import { useStorage } from "@plasmohq/storage/hook"

import type { OrganizationStorage } from "~api/organization"
import { supabase } from "~core/supabase"

import { version } from "../package.json"
import { useEffect } from "react"

const Sentry = _Sentry
Sentry.init({
  dsn: process.env.PLASMO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `deskroom-extension@v${version}`
})

function IndexPopup() {
  useEffect(() => {
    browser.runtime.sendMessage({ event: "get-session" })
  }, [])

  const [user] = useStorage<User>("user")
  const [orgs] = useStorage<OrganizationStorage | null>("orgs")

  const cleanUpStorage = () => {
    browser.runtime.sendMessage({ event: "logout" })
  }

  return (
    <Flex className="w-60 h-64 px-4 py-2">
      <Flex className="container" direction="column">
        <Flex direction="row" style={{ display: "flex" }}>
          <img src={deskroomLogo} alt="deskroom logo" className="w-20 my-2" />
          <IconButton className="ml-auto hover:bg-gray-100 px-2">
            <GearIcon />
          </IconButton>
        </Flex>
        <Flex className="py-2" gap="3">
          <Box className="my-2 flex flex-col">
            <label htmlFor="org" className="text-gray-400">
              소속
            </label>
            <input
              type="text"
              id="org"
              value={orgs?.currentOrg?.key || ""}
              placeholder="소속"
              disabled
            />
          </Box>
          <Separator size="4" />
          <Box className="my-2 flex flex-col">
            <label htmlFor="account" className="text-gray-400">
              로그인 된 계정
            </label>
            <input
              type="text"
              id="account"
              value={user?.email || ""}
              placeholder="로그인 된 계정"
              disabled
            />
          </Box>
        </Flex>
        <Button
          className="w-full rounded bg-primary-900 py-2 text-white"
          onClick={cleanUpStorage}>
          로그아웃
        </Button>
      </Flex>
      <Separator color="gray" size="4" />
      <Box
        className="text-center py-4 flex align-center justify-center cursor-pointer"
        onClick={() => {
          chrome.tabs?.create({ active: true, url: "https://app.deskroom.so" })
        }}>
        Knowledge Base로 이동
        <IconButton>
          <ArrowTopRightIcon />
        </IconButton>
      </Box>
    </Flex>
  )
}

export default Sentry.withProfiler(IndexPopup)
