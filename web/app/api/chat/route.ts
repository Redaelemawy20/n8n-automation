// POST /api/chat  body: { "message": "...", "sessionId": "..." }  ->  { "reply": "..." }
// Forwards the message to the n8n "ElevenLabs Orchestrator" workflow.
import { HttpError, readJsonObject, withErrors } from "@/lib/http";
import { postToWebhook, webhooks } from "@/lib/n8n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: Request) => {
  const body = await readJsonObject(req);
  const message = String(body.message ?? "").trim();
  const sessionId = String(body.sessionId ?? "").trim();
  if (!message) throw new HttpError(400, "message is required");
  if (!sessionId) throw new HttpError(400, "sessionId is required");

  const res = await postToWebhook(webhooks.orchestrator, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = (await res.json().catch(() => null)) as { reply?: unknown } | null;
  if (typeof data?.reply !== "string") throw new HttpError(502, "n8n returned no reply");
  return Response.json({ reply: data.reply });
});
