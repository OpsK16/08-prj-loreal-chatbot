# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

Enjoy building your L’Oréal beauty assistant! 💄

## What This Version Includes

- L'Oreal-style branding (logo + color palette)
- Chat bubbles for user and assistant messages
- Latest user question shown above the chat
- Multi-turn conversation history
- System prompt that keeps answers focused on L'Oreal beauty topics
- Cloudflare Worker template to protect your API key

## L'Oreal Font Direction (Monotype Case Study)

From Monotype's L'Oreal case-study direction, the visual language balances:

- Premium editorial tone (serif headline style)
- Clear modern readability (clean sans-serif body text)

This project applies that idea with:

- `Playfair Display` for hero/title personality
- `Manrope` for readable interface text

If your class requires exact licensed brand fonts, use your assigned font files/licenses instead of web Google fonts.

## 1) Local Secrets Setup (Temporary)

Create a file named `secrets.js` in the root folder.

Example:

```js
window.OPENAI_API_KEY = "your-openai-api-key-here";
window.CLOUDFLARE_WORKER_URL = "";
```

Notes:

- `secrets.js` is listed in `.gitignore`.
- For production, use only `CLOUDFLARE_WORKER_URL` and remove the local API key.

## 2) Configure Chatbot Prompt Behavior

In `script.js`, a `SYSTEM_PROMPT` is included so the assistant:

- Answers only L'Oreal product/routine/beauty questions
- Politely refuses unrelated questions
- Gives concise beginner-friendly responses

## 3) Create + Deploy Cloudflare Worker

Use `RESOURCE_cloudflare-worker.js` as your Worker source.

High-level steps:

1. Open Cloudflare Workers dashboard.
2. Create a new Worker.
3. Paste the code from `RESOURCE_cloudflare-worker.js`.
4. Add secret in Worker settings:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI key
5. Deploy the Worker.
6. Copy the deployed Worker URL.

If your class provided a helper deployment script/process, follow that for publishing.

## 4) Point Frontend to Worker Endpoint

In `secrets.js`, set:

```js
window.CLOUDFLARE_WORKER_URL =
  "https://your-worker-name.your-subdomain.workers.dev";
```

Once this value is set, `script.js` automatically sends requests to your Worker endpoint (recommended secure path).
