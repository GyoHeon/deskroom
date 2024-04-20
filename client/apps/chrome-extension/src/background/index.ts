import browser from "webextension-polyfill"

import { getCategories } from "~api/categories"
import { getCookie } from "~api/cookie"
import { getOrganizations } from "~api/organization"
import { supabase } from "~core/supabase"
import { deskroomUserStorage } from "~store"

export {}

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
  const { user, organizations, categories, error } =
    await getSessionFromCookie()

  if (!!error) {
    console.error(error)
    browser.storage.sync.set({ user: null, orgs: null, cate: null })
    await supabase.auth.signOut()
    return
  }
  const isExisting =
    !!(await deskroomUserStorage.get("user")) &&
    !!user &&
    !!organizations &&
    !!categories
  if (!isExisting) {
    deskroomUserStorage.set("user", user)
    deskroomUserStorage.set("orgs", organizations)
    deskroomUserStorage.set("cate", categories)
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
    browser.storage.sync.set({ user: null, orgs: null, cate: null })
    return {
      user: null,
      organizations: null,
      categories: null,
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
      categories: null,
      error: "유저를 찾을 수 없습니다"
    }
  }

  const organizations = await getOrganizations(user.email)
  console.log(organizations.currentOrg.key)
  // const categories = await getCategories(organizations.currentOrg.key)
  const categories = await getCategories("demo")

  console.log("getSessionFromCookie", { categories })

  return {
    user,
    organizations,
    categories,
    error: null
  }
}
