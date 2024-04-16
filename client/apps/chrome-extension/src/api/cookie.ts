
export async function getCookie(name: string) {
  const cookie = await chrome.cookies.get({
    url: process.env.PLASMO_PUBLIC_KMS_URL,
    name: name
  })
  if (!cookie) {
    console.error("Cookie not found")
  }
  return decodeURIComponent(cookie.value)
}
