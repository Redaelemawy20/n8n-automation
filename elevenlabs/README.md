# elevenlabs

Ask a question out loud on a web page and hear the answer. The recording goes to an n8n webhook. ElevenLabs Speech-to-Text (Scribe) transcribes it, an AI agent running OpenAI `gpt-4.1-mini` answers it, and ElevenLabs turns the answer into speech using the "Sarah" voice. The MP3 is returned in the webhook response and plays on the page.

- **Trigger:** `POST /webhook/tts` with multipart form data whose `audio` field holds the recording (webm, wav, mp3, …). The response is the spoken answer as `audio/mp3`. The `/tts` page in the [order-automation](../order-automation/) Next.js app records from the microphone and sends it through its `/api/tts` route. Set `N8N_TTS_WEBHOOK_URL` if n8n isn't at `http://localhost:5678`. The workflow has to be active in n8n for the webhook to respond.
- **Workflow:** `workflows/TTS.workflow.ts` (n8n workflow "TTS"): Webhook → Transcribe audio → AI Agent → Convert text to speech → Respond to Webhook. It needs ElevenLabs and OpenAI credentials set up in n8n.
- **Sync:** run `npm install`, then `npx n8nac pull <id>` / `npx n8nac push <file>` from this folder, using [n8n-as-code](https://n8nascode.dev).
