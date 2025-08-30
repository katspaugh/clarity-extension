import browser from 'webextension-polyfill';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Listen for messages from content scripts requesting that a page's HTML be
// processed by the OpenAI API. The message should include the raw HTML. The
// response is expected to be a JSON object with `html` containing the cleaned
// markup and `summary` providing an optional summary of the page.
browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'process-html') {
    const prompt = `You will be given the full HTML of a web page. Remove any\n` +
      `nagging popups, ads, and cookie banners. Improve accessibility and\n` +
      `readability while preserving the original design concept and colour\n` +
      `palette when possible. If the page is long, return a short summary.\n` +
      `Respond with a JSON object: {"html": string, "summary": string}.`;

    if (!apiKey) {
      console.error('Missing VITE_OPENAI_API_KEY');
      return { html: msg.html, summary: '' };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: msg.html }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      return JSON.parse(content);
    } catch {
      // If parsing fails, return the original HTML so the page remains usable.
      return { html: msg.html, summary: '' };
    }
  }
});

