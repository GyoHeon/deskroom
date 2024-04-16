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
  const cookieName = process.env.PLASMO_PUBLIC_KMS_COOKIE_KEY
  if (!cookieName) {
    console.error("Cookie name not found")
    return
  }
  const cookieValue = await getCookie(cookieName)

  if (!cookieValue) {
    console.error("Cookie value not found")
    deskroomUserStorage.remove("user")
    return
  }

  deskroomUserStorage.set("user", cookieValue)

  // TODO: find a way to create or retrieve session from supabase

  const organizations = await deskroomUserStorage.get("organizations")
  if (!organizations) {
    const organizations = await getOrganizations(cookieValue.email)
    deskroomUserStorage.set("organizations", organizations)
  }
})
