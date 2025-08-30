import browser from 'webextension-polyfill';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Listen for messages from content scripts requesting that a page's HTML be
// processed by the OpenAI API. The message should include the raw HTML. The
// response is expected to be a JSON object with `html` containing the cleaned
// markup and `summary` providing an optional summary of the page.
browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === 'process-html') {
    const prompt =
      `You will be given the full HTML of a web page. Remove nagging popups, ads,` +
      ` cookie banners, and decorative elements that distract from the main` +
      ` content. Simplify the layout to prioritise text, improve typography and` +
      ` spacing for readability, and aim for the clarity of Safari's Reader` +
      ` view while keeping the original design concept and colour palette when` +
      ` possible. If the page is long, return a short summary. Respond with a` +
      ` JSON object: {"html": string, "summary": string}.`;

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

