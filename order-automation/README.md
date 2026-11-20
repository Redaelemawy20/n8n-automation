# order-automation

n8n workflows for the shop's ordering and product catalog.

- **crepe home** (`workflows/crepe home.workflow.ts`): customers place orders by sending a Telegram message to the shop's bot, one item per line with the quantity first (for example `2 nutella crepe`). Arabic-Indic digits work too. The workflow turns each line into an order, sends it to `POST /api/orders` in the [web](../web/) app (which stores it in SQLite), and replies on Telegram to confirm each item. Staff follow incoming orders at http://localhost:3000/orders. The web app must be running for orders to be saved.
- **Product Catalog Seeder** (`workflows/Product Catalog Seeder.workflow.ts`): `POST /webhook/seed-products` appends a fixed list of 100 dummy products (`Name`, `Description`, `Price`, `Category`, `Stock`, `CreatedAt`) to the [product catalog sheet](https://docs.google.com/spreadsheets/d/1Txajl1p6_ftfXh1t17xsDAQekMjMnkaaLYgMiNUuZtY/edit?gid=0#gid=0) and responds with `{ "added": 100 }`. Send `{ "count": n }` to add only the first `n` products. Every call appends them again.
- **Sync:** run `npm install`, then `npx n8nac pull <id>` / `npx n8nac push <file>` from this folder, using [n8n-as-code](https://n8nascode.dev).
