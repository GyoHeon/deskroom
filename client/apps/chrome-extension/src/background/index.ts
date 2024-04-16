import browser from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { getOrganizations } from "~api/organization"

import { getCookie } from "../api/cookie"
import { supabase } from "~core/supabase"

export { }

const deskroomUserStorage = new Storage()

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

browser.tabs.onActivated.addListener(async () => {
  const cookiePrefix = process.env.PLASMO_PUBLIC_KMS_COOKIE_PREFIX
  if (!cookiePrefix) {
    console.error("Cookie name not found")
    return
  }
  const accessToken = await getCookie(`${cookiePrefix}-access-token`)
  const refreshToken = await getCookie(`${cookiePrefix}-refresh-token`)

  if (!accessToken || !refreshToken) {
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

  // TODO: find a way to create or retrieve session from supabase

  const organizations = await deskroomUserStorage.get("organizations")
  if (!organizations) {
    const organizations = await getOrganizations(user.email)
    deskroomUserStorage.set("organizations", organizations)
  }
})
