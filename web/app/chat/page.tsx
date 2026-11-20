import ChatBox from "./ChatBox";

export default function ChatPage() {
  return (
    <main>
      <h1>Chat</h1>
      <p className="sub">
        Chat with the n8n <code>ElevenLabs Orchestrator</code> workflow. Its AI agent answers
        questions about the meals using the meals Google Sheet.
      </p>
      <div className="card">
        <ChatBox />
      </div>
    </main>
  );
}
