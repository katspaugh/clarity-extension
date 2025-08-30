import browser from 'webextension-polyfill';

const button = document.getElementById('analyze') as HTMLButtonElement;

button.addEventListener('click', async () => {
  const apiKey = 'YOUR_OPENAI_API_KEY';
  const result = await browser.runtime.sendMessage({ type: 'analyze-tab', apiKey });
  console.log(result);
});
