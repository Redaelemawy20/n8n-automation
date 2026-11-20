# web

A Next.js app with the pages and API routes that the n8n automations talk to.

| Page | API route | What it does |
| --- | --- | --- |
| `/orders` | `GET/POST /api/orders` | Lists orders saved by the **crepe home** workflow ([order-automation](../order-automation/)). Orders are stored in SQLite at `data/orders.db`, and the page refreshes every 5 seconds. |
| `/chat` | `POST /api/chat` | Text chat with the **ElevenLabs Orchestrator** workflow ([elevenlabs](../elevenlabs/)). |
| `/tts` | `POST /api/tts` | Record a question and hear the answer from the **TTS** workflow ([elevenlabs](../elevenlabs/)). |

- **Run:** `npm install && npm run dev`, then open http://localhost:3000.
- **Check types:** `npm run typecheck`.
- **Config:** n8n is expected at `http://localhost:5678`. To change it, copy [.env.example](.env.example) to `.env.local`. The `/chat` and `/tts` pages only work while their workflow is active in n8n.

## Layout

- `app/`: pages, plus API routes in `app/api/`
- `lib/db.ts`: the SQLite orders store
- `lib/n8n.ts`: n8n webhook URLs and `postToWebhook`
- `lib/http.ts`: shared route helpers (`HttpError`, `withErrors`, `readJsonObject`)
