// GET  /api/orders  ->  all orders, newest first
// POST /api/orders  body: { "item_name": "Coffee", "quantity": 2 }  ->  the created order
// Called by the n8n "crepe home" workflow (order-automation/workflows).
import { createOrder, listOrders } from "@/lib/db";
import { HttpError, readJsonObject, withErrors } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(listOrders());
}

export const POST = withErrors(async (req: Request) => {
  const body = await readJsonObject(req);
  // "itemName" / "item" are accepted too, for convenience from n8n.
  const itemName = String(body.item_name ?? body.itemName ?? body.item ?? "").trim();
  const quantity = Number(body.quantity);

  if (!itemName) throw new HttpError(400, "item_name is required");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, "quantity must be a positive integer");
  }

  return Response.json(createOrder(itemName, quantity), { status: 201 });
});
