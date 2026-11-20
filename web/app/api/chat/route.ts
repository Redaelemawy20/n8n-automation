// POST /api/chat  body: { "message": "...", "sessionId": "..." }
// Forwards the message to the n8n "ElevenLabs Orchestrator" workflow
// (elevenlabs/workflows/ElevenLabs Orchestrator.workflow.ts) and returns its { reply }.
// The production webhook only responds while the workflow is active in n8n.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_URL =
  process.env.N8N_ORCHESTRATOR_WEBHOOK_URL ?? "http://localhost:5678/webhook/orchestrator";

export async function POST(req: Request) {
  let body: { message?: unknown; sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  const message = String(body.message ?? "").trim();
  const sessionId = String(body.sessionId ?? "").trim();
  if (!message) return Response.json({ error: "message is required" }, { status: 400 });
  if (!sessionId) return Response.json({ error: "sessionId is required" }, { status: 400 });

  let res: Response;
  try {
    res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });
  } catch (err) {
    return Response.json(
      { error: `Could not reach n8n at ${WEBHOOK_URL}: ${(err as Error).message}` },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return Response.json(
      { error: `n8n webhook returned ${res.status}: ${await res.text()}` },
      { status: 502 },
    );
  }

  const data = (await res.json().catch(() => null)) as { reply?: unknown } | null;
  if (typeof data?.reply !== "string") {
    return Response.json({ error: "n8n returned no reply" }, { status: 502 });
  }
  return Response.json({ reply: data.reply });
}
