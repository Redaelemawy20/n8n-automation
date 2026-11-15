# elevenlabs

Ask a question from a web page and have the answer turned into speech. The question goes to an n8n webhook, an AI agent running OpenAI `gpt-4.1-mini` answers it, and ElevenLabs turns the answer into audio using the "Sarah" voice. The page doesn't play or show the answer yet.

- **Trigger:** `POST /webhook/tts` with `{ "question": "..." }`. The form at `/tts` in the [order-automation](../order-automation/) Next.js app sends this request. Set `N8N_TTS_WEBHOOK_URL` if n8n isn't at `http://localhost:5678`. The workflow has to be active in n8n for the webhook to respond.
- **Workflow:** `workflows/TTS.workflow.ts` (n8n workflow "TTS"). It needs ElevenLabs and OpenAI credentials set up in n8n.
- **Sync:** run `npm install`, then `npx n8nac pull <id>` / `npx n8nac push <file>` from this folder, using [n8n-as-code](https://n8nascode.dev).
