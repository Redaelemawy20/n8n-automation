"use server";

// n8n "TTS" workflow webhook (elevenlabs/workflows/TTS.workflow.ts).
// Production URL only works while the workflow is active in n8n.
const WEBHOOK_URL =
  process.env.N8N_TTS_WEBHOOK_URL ?? "http://localhost:5678/webhook/tts";

export type AskState = { ok: boolean; message: string } | null;

export async function askQuestion(_prev: AskState, formData: FormData): Promise<AskState> {
  const question = String(formData.get("question") ?? "").trim();
  if (!question) {
    return { ok: false, message: "Please write a question first." };
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) {
      return { ok: false, message: `n8n webhook returned ${res.status}: ${await res.text()}` };
    }
  } catch (err) {
    return { ok: false, message: `Could not reach n8n at ${WEBHOOK_URL}: ${(err as Error).message}` };
  }

  return { ok: true, message: "Sent. The TTS workflow was triggered." };
}
