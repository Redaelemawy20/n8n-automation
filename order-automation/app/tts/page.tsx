import VoiceForm from "./VoiceForm";

export default function TtsPage() {
  return (
    <main>
      <h1>Ask (TTS)</h1>
      <p className="sub">
        Record a question. The n8n <code>TTS</code> workflow transcribes it, answers it with an AI
        agent, and plays the answer back as ElevenLabs speech.
      </p>
      <div className="card">
        <VoiceForm />
      </div>
    </main>
  );
}
