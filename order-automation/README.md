# order-automation

Customers place orders by sending a Telegram message to the shop's bot, one item per line with the quantity first (for example `2 nutella crepe`). Arabic-Indic digits work too. The **crepe home** n8n workflow turns each line into an order and saves it through a small Next.js API that stores orders in SQLite. It then replies on Telegram to confirm each item it received. Staff can follow incoming orders on a web page that refreshes on its own.

- **Run:** `cd order-automation && npm install && npm run dev` → orders page at http://localhost:3000/orders, API at `POST /api/orders` with `{ "item_name", "quantity" }`.
- **Workflows:** TypeScript files in `workflows/` synced with [n8n-as-code](https://n8nascode.dev) using `npx n8nac pull <id>` and `npx n8nac push <file> --draft`.
