"use client";

import { useActionState } from "react";
import { askQuestion, type AskState } from "./actions";

export default function AskForm() {
  const [state, formAction, pending] = useActionState<AskState, FormData>(askQuestion, null);

  return (
    <form action={formAction} className="ask-form">
      <label htmlFor="question">Your question</label>
      <textarea
        id="question"
        name="question"
        rows={5}
        required
        placeholder="Ask anything…"
      />
      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
      {state && (
        <p className={state.ok ? "status ok" : "status error"} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
