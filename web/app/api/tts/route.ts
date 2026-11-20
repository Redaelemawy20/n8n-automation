// POST /api/tts  multipart body: audio=<recording>  ->  the spoken answer (audio)
// Forwards the recording to the n8n "TTS" workflow and streams back its audio reply.
import { HttpError, withErrors } from "@/lib/http";
import { postToWebhook, webhooks } from "@/lib/n8n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: Request) => {
  const form = await req.formData().catch(() => {
    throw new HttpError(400, "Body must be multipart/form-data");
  });
  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    throw new HttpError(400, "An 'audio' file is required");
  }

  const forward = new FormData();
  forward.append("audio", audio, audio instanceof File ? audio.name : "recording.webm");
  const res = await postToWebhook(webhooks.tts, { body: forward });

  return new Response(res.body, {
    headers: { "Content-Type": res.headers.get("content-type") ?? "audio/mpeg" },
  });
});
