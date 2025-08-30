import browser from 'webextension-polyfill';

// Store a copy of the original HTML so we can restore it if the user requests.
let originalHtml = '';

// Once the page fully loads, send the HTML to the background script to be
// processed by OpenAI.
window.addEventListener('load', async () => {
  originalHtml = document.documentElement.innerHTML;

  try {
    const result = await browser.runtime.sendMessage({
      type: 'process-html',
      html: originalHtml
    });

    if (result && result.html) {
      document.documentElement.innerHTML = result.html;

      if (result.summary) {
        const summaryDiv = document.createElement('div');
        summaryDiv.id = 'clarity-summary';
        summaryDiv.style.padding = '1em';
        summaryDiv.style.backgroundColor = 'rgba(255,255,255,0.9)';
        summaryDiv.style.fontFamily = 'Arial, sans-serif';
        summaryDiv.style.fontSize = '1rem';
        summaryDiv.style.color = '#000';

        const summaryText = document.createElement('p');
        summaryText.textContent = result.summary;
        summaryDiv.appendChild(summaryText);

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = 'Show original';
        restoreBtn.addEventListener('click', () => {
          document.documentElement.innerHTML = originalHtml;
        });
        summaryDiv.appendChild(restoreBtn);

        document.body.insertBefore(summaryDiv, document.body.firstChild);
      }
    }
  } catch (err) {
    console.error('Failed to process page', err);
  }
});

