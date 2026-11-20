# n8n-automation

A collection of n8n automations. Each automation folder holds its workflows as code ([n8n-as-code](https://n8nascode.dev)), and the shared web app holds the pages and APIs those workflows talk to.

| Folder | Description |
| --- | --- |
| [order-automation](order-automation/) | Takes customer orders sent to a Telegram bot, saves them through the web app and confirms them in Telegram. Also has a workflow that fills the product catalog sheet with 100 dummy products. |
| [elevenlabs](elevenlabs/) | Voice Q&A (a recorded question is transcribed, answered by an AI agent and spoken back with ElevenLabs) and a text chat about the restaurant's meals |
| [web](web/) | Next.js app: the orders page and API, plus the `/chat` and `/tts` pages that call the elevenlabs workflows |

## Layout

```
<automation>/
  workflows/*.workflow.ts   n8n workflows as TypeScript
  n8nac-config.json         n8n-as-code settings (n8n at http://localhost:5678)
  package.json              n8nac only
web/                        Next.js app (npm run dev → http://localhost:3000)
```

To sync a workflow, run `npm install` once in its folder, then `npx n8nac pull <id>` or `npx n8nac push <file>`.
