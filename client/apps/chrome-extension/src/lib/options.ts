import browser from "webextension-polyfill"

export const openOptions = () => {
  const optionsURL = browser.runtime.getURL("options.html")
  window.open(optionsURL, "_blank", "noopener, noreferrer")
}
