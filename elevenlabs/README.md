# elevenlabs

Chat with an AI agent and hear its reply spoken aloud. A message sent through the n8n chat goes to an AI agent running OpenAI `gpt-4.1-mini`. ElevenLabs then turns the agent's answer into speech using the "Sarah" voice.

- **Workflow:** `workflows/TTS.workflow.ts` (n8n workflow "TTS"). It needs ElevenLabs and OpenAI credentials set up in n8n.
- **Sync:** run `npm install`, then `npx n8nac pull <id>` / `npx n8nac push <file> --draft` from this folder, using [n8n-as-code](https://n8nascode.dev).