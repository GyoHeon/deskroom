import browser from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { getOrganizations } from "~api/organization"

import { getCookie } from "../api/cookie"
import { supabase } from "~core/supabase"

export { }

const deskroomUserStorage = new Storage()

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})

type BrowserRuntimeMessageRequest = {
  event: "logout" | "get-session"
}

browser.runtime.onMessage.addListener(async (request: BrowserRuntimeMessageRequest) => {
  if (request.event === "logout") {
    browser.storage.sync.set({ user: null, orgs: null })
    await supabase.auth.signOut()
    return
  }

  if (request.event === "get-session") {
    const isExisting = !!(await deskroomUserStorage.get("user"))
    if (isExisting) return;
    await getSessionFromCookie()
    return
  }

  console.error("Unknown event")
})

async function getSessionFromCookie() {
  const cookiePrefix = process.env.PLASMO_PUBLIC_KMS_COOKIE_PREFIX
  if (!cookiePrefix) {
    console.error("Cookie name not found")
    return
  }
  const accessToken = await getCookie(`${cookiePrefix}-access-token`)
  const refreshToken = await getCookie(`${cookiePrefix}-refresh-token`)

  if (!accessToken || !refreshToken) {
    browser.storage.sync.set({ user: null, orgs: null })
    return
  }

  const { data: { session, user }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  if (!session || !user || !!error) {
    console.error('유저를 찾을 수 없습니다')
    return
  }

  deskroomUserStorage.set("user", user)

  const organizations = await deskroomUserStorage.get("organizations")
  if (!organizations) {
    const organizations = await getOrganizations(user.email)
    deskroomUserStorage.set("orgs", organizations)
  }

  return {
    user,
    organizations
  }
}
