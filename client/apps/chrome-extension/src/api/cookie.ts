
export async function getCookie(name: string): Promise<string | undefined> {
  const cookie = await chrome.cookies.get({
    url: process.env.PLASMO_PUBLIC_KMS_URL,
    name: name
  })
  if (!cookie) {
    console.debug("Cookie not found")
    return
  }
  return decodeURIComponent(cookie.value)
}
