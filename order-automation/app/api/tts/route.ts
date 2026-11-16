// POST /api/tts  multipart body: audio=<recording>
// Forwards the recording to the n8n "TTS" workflow (elevenlabs/workflows/TTS.workflow.ts)
// and streams back the spoken answer it returns. The production webhook only
// responds while the workflow is active in n8n.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_URL = process.env.N8N_TTS_WEBHOOK_URL ?? "http://localhost:5678/webhook/tts";

export async function POST(req: Request) {
  let audio: FormDataEntryValue | null;
  try {
    audio = (await req.formData()).get("audio");
  } catch {
    return Response.json({ error: "Body must be multipart/form-data" }, { status: 400 });
  }
  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: "An 'audio' file is required" }, { status: 400 });
  }

  const forward = new FormData();
  forward.append("audio", audio, audio instanceof File ? audio.name : "recording.webm");

  let res: Response;
  try {
    res = await fetch(WEBHOOK_URL, { method: "POST", body: forward });
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

  return new Response(res.body, {
    headers: { "Content-Type": res.headers.get("content-type") ?? "audio/mpeg" },
  });
}
