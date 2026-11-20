import { HttpError } from "./http";

// n8n production webhooks only respond while their workflow is active in n8n.
const N8N_BASE_URL = (process.env.N8N_BASE_URL ?? "http://localhost:5678").replace(/\/+$/, "");

/** Webhook URLs of the workflows this app calls. Each can be overridden on its own. */
export const webhooks = {
  /** "ElevenLabs Orchestrator" workflow (elevenlabs/workflows) */
  orchestrator:
    process.env.N8N_ORCHESTRATOR_WEBHOOK_URL ?? `${N8N_BASE_URL}/webhook/orchestrator`,
  /** "TTS" workflow (elevenlabs/workflows) */
  tts: process.env.N8N_TTS_WEBHOOK_URL ?? `${N8N_BASE_URL}/webhook/tts`,
};

/**
 * POSTs to an n8n webhook and returns its response.
 * Throws a 502 HttpError if n8n can't be reached or answers with a non-2xx status.
 */
export async function postToWebhook(url: string, init: Omit<RequestInit, "method">): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, method: "POST" });
  } catch (err) {
    throw new HttpError(502, `Could not reach n8n at ${url}: ${(err as Error).message}`);
  }
  if (!res.ok) {
    throw new HttpError(502, `n8n webhook returned ${res.status}: ${await res.text()}`);
  }
  return res;
}
