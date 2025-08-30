import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'get-page-content') {
    const content = document.body.innerText;
    return Promise.resolve({ content });
  }
});
