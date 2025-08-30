import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'analyze-tab') {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) {
      return;
    }
    const { content } = await browser.tabs.sendMessage(tab.id, { type: 'get-page-content' });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${msg.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }]
      })
    });
    return response.json();
  }
});
