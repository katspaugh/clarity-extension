# Clarity Extension

This repository contains a minimal Chrome and Firefox extension built with
[TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/).
The extension injects a content script into the current tab so it can read the
page's text content and send it to the background service worker. The background
script demonstrates how to forward that content to the OpenAI API.

## Development

```bash
npm install
npm run build
```

The built extension will be output to the `dist/` directory.
