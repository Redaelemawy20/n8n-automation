// Small helpers shared by the API route handlers.

/** An error that should be returned to the client as `{ error }` with this status. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/** Parses a JSON object body, or throws a 400 HttpError. */
export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
  const body: unknown = await req.json().catch(() => undefined);
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "Body must be a JSON object");
  }
  return body as Record<string, unknown>;
}

/** Wraps a route handler so a thrown HttpError becomes a JSON `{ error }` response. */
export function withErrors<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof HttpError) return jsonError(err.message, err.status);
      throw err;
    }
  };
}
