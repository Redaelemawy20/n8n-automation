import AskForm from "./AskForm";

export default function TtsPage() {
  return (
    <main>
      <h1>Ask (TTS)</h1>
      <p className="sub">
        Sends your question to the n8n <code>TTS</code> workflow, which answers it and turns the
        answer into ElevenLabs speech.
      </p>
      <div className="card">
        <AskForm />
      </div>
    </main>
  );
}
