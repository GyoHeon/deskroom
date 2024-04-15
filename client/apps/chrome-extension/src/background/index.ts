import browser from 'webextension-polyfill'
import { Storage } from '@plasmohq/storage';
import { getCookie } from '../api/cookie';
import { getOrganizations } from '~api/organization';

export { }

const deskroomUserStorage = new Storage();

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

browser.tabs.onActivated.addListener(async () => {
  const cookieName = process.env.PLASMO_PUBLIC_KMS_COOKIE_KEY;
  if (!cookieName) {
    console.error("Cookie name not found")
    return
  }
  const cookieValue = await getCookie(cookieName);

  if (!cookieValue) {
    console.error("Cookie value not found")
    deskroomUserStorage.remove('user');
    return
  }

  deskroomUserStorage.set('user', cookieValue);

  deskroomUserStorage.watch({
    user: async (c) => {
      console.log("User changed", c.newValue)
      const organizations = await getOrganizations(c.newValue.email)
      console.log("Organizations", organizations)
    }
  })

  if (!deskroomUserStorage.get('organizations')) {
    const organizations = await getOrganizations(cookieValue.email);
    deskroomUserStorage.set('organizations', organizations);
  }
})


