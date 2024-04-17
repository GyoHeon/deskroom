import browser from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { getOrganizations } from "~api/organization"
import { supabase } from "~core/supabase"

import { getCookie } from "~api/cookie"

export { }

const deskroomUserStorage = new Storage()

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})

type BrowserRuntimeMessageRequest = {
  event: "logout" | "get-session"
}

browser.runtime.onMessage.addListener(
  async (request: BrowserRuntimeMessageRequest) => {
    if (request.event === "logout") {
      browser.storage.sync.set({ user: null, orgs: null })
      await supabase.auth.signOut()
      return
    }

    if (request.event === "get-session") {
      // if (isExisting) return;
      // const { user } = await getSessionFromCookie()
      // if (!!user) {
      //   chrome.tabs.create({
      //     url: "./tabs/login-success.html",
      //     active: true
      //   })
      // }
      return
    }

    console.error("Unknown event")
  }
)

setInterval(async () => {
  const { user, organizations, error } = await getSessionFromCookie()
  if (!!error) {
    console.error(error)
    browser.storage.sync.set({ user: null, orgs: null })
    await supabase.auth.signOut()
    return
  }
  const isExisting =
    !!(await deskroomUserStorage.get("user")) && !!user && !!organizations
  if (!isExisting) {
    deskroomUserStorage.set("user", user)
    deskroomUserStorage.set("orgs", organizations)
    chrome.tabs.create({
      url: "./tabs/login-success.html"
    })
  }
}, 5000)

async function getSessionFromCookie() {
  const cookiePrefix = process.env.PLASMO_PUBLIC_KMS_COOKIE_PREFIX
  if (!cookiePrefix) {
    console.debug("Cookie name not found")
    return
  }
  const accessToken = await getCookie(`${cookiePrefix}-access-token`)
  const refreshToken = await getCookie(`${cookiePrefix}-refresh-token`)

  if (!accessToken || !refreshToken) {
    browser.storage.sync.set({ user: null, orgs: null })
    return {
      user: null,
      organizations: null,
      error: "토큰을 찾을 수 없습니다"
    }
  }

  const {
    data: { session, user },
    error
  } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  if (!session || !user || !!error) {
    console.error("유저를 찾을 수 없습니다")
    return {
      user: null,
      organizations: null,
      error: "유저를 찾을 수 없습니다"
    }
  }

  const organizations = await getOrganizations(user.email)

  return {
    user,
    organizations,
    error: null
  }
}
