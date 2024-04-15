import type { User } from "@supabase/supabase-js"
import { jwtDecode } from "jwt-decode"

export async function getCookie(name: string) {
  const cookie = await chrome.cookies.get({
    url: process.env.PLASMO_PUBLIC_KMS_URL,
    name: name
  })
  if (!cookie) {
    console.error("Cookie not found")
  }
  const urlDecoded = decodeURIComponent(cookie.value)
  const parsed = JSON.parse(urlDecoded)
  const token = parsed?.[0]
  return jwtDecode(token) as User
}
