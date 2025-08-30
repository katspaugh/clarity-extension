# Clarity Extension

This repository contains a minimal Chrome and Firefox extension built with
[TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/).
The extension injects a content script into the current tab so it can read the
page's text content and send it to the background service worker. The background
script demonstrates how to forward that content to the OpenAI API.

The background script reads the OpenAI API key from the `VITE_OPENAI_API_KEY`
environment variable.

## Development

```bash
export VITE_OPENAI_API_KEY=your_key_here
npm install
npm run build
```

The built extension will be output to the `dist/` directory.
