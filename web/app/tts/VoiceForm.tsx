"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "recording" | "review" | "sending";
type Status = { ok: boolean; message: string } | null;

export default function VoiceForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState<Status>(null);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [answerUrl, setAnswerUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Free object URLs when they're replaced or on unmount.
  useEffect(() => () => { if (recordingUrl) URL.revokeObjectURL(recordingUrl); }, [recordingUrl]);
  useEffect(() => () => { if (answerUrl) URL.revokeObjectURL(answerUrl); }, [answerUrl]);

  async function startRecording() {
    setStatus(null);
    setRecording(null);
    setRecordingUrl(null);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setStatus({ ok: false, message: `Microphone unavailable: ${(err as Error).message}` });
      return;
    }

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      if (blob.size === 0) {
        setPhase("idle");
        setStatus({ ok: false, message: "Nothing was recorded. Try again." });
        return;
      }
      setRecording(blob);
      setRecordingUrl(URL.createObjectURL(blob));
      setPhase("review");
    };
    recorderRef.current = recorder;
    recorder.start();
    setPhase("recording");
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
  }

  async function send() {
    if (!recording) return;
    setPhase("sending");
    setStatus(null);
    const ext = recording.type.includes("mp4") ? "mp4" : recording.type.includes("ogg") ? "ogg" : "webm";
    const body = new FormData();
    body.append("audio", recording, `recording.${ext}`);

    try {
      const res = await fetch("/api/tts", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed with ${res.status}`);
      }
      setAnswerUrl(URL.createObjectURL(await res.blob()));
      setStatus({ ok: true, message: "Here's the answer." });
    } catch (err) {
      setStatus({ ok: false, message: (err as Error).message });
    } finally {
      setPhase("review");
    }
  }

  return (
    <div className="ask-form">
      <label>Ask with your voice</label>

      {phase === "recording" ? (
        <button type="button" onClick={stopRecording} className="recording">
          ■ Stop
        </button>
      ) : (
        <div className="actions">
          <button
            type="button"
            onClick={startRecording}
            disabled={phase === "sending"}
            className={recording ? "secondary" : undefined}
          >
            {recording ? "🎙 Record again" : "🎙 Record"}
          </button>
          {recording && (
            <button type="button" onClick={send} disabled={phase === "sending"}>
              {phase === "sending" ? "Thinking…" : "Send"}
            </button>
          )}
        </div>
      )}

      {recordingUrl && phase !== "recording" && (
        <div className="clip">
          <span className="clip-label">Your recording</span>
          <audio key={recordingUrl} src={recordingUrl} controls />
        </div>
      )}

      {status && (
        <p className={status.ok ? "status ok" : "status error"} role="status">
          {status.message}
        </p>
      )}

      {answerUrl && (
        <div className="clip">
          <span className="clip-label">Answer</span>
          <audio key={answerUrl} src={answerUrl} controls autoPlay />
        </div>
      )}
    </div>
  );
}
