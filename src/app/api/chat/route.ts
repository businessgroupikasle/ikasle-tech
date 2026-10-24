import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { chatbotConfig, createProviderResponse } from "@/lib/chatbot/provider";
import { localAnswer } from "@/lib/chatbot/knowledge";
import { chatRequestSchema } from "@/lib/chatbot/validation";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 24_000;

function ip(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function GET() {
  const config = chatbotConfig();
  return NextResponse.json({ enabled: config.enabled, aiAvailable: config.configured, mode: config.configured ? "ai" : "local" });
}

export async function POST(req: NextRequest) {
  const config = chatbotConfig();
  if (!config.enabled) return NextResponse.json({ error: "The assistant is currently unavailable." }, { status: 503 });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const limit = rateLimit(`chat:${ip(req)}`, 20, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const parsed = chatRequestSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Please shorten your message or start a new conversation." }, { status: 422 });

  if (!config.configured) {
    const last = parsed.data.messages.at(-1)!.content;
    return new Response(localAnswer(last), { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Chat-Mode": "local", "Cache-Control": "no-store" } });
  }

  try {
    const upstream = await createProviderResponse(parsed.data.messages, req.signal);
    if (!upstream.ok || !upstream.body) {
      console.error("[chat] provider failure", upstream.status);
      return NextResponse.json({ error: upstream.status === 429 ? "The assistant is busy. Please retry shortly." : "The assistant could not respond right now." }, { status: upstream.status === 429 ? 429 : 502 });
    }
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = upstream.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";
            for (const block of events) {
              const data = block.split("\n").find((line) => line.startsWith("data: "))?.slice(6);
              if (!data || data === "[DONE]") continue;
              try {
                const event = JSON.parse(data) as { type?: string; delta?: string; message?: string };
                if (event.type === "response.output_text.delta" && event.delta) controller.enqueue(encoder.encode(event.delta));
                if (event.type === "error") throw new Error(event.message ?? "Provider stream error");
              } catch (error) { if (error instanceof SyntaxError) continue; throw error; }
            }
          }
          controller.close();
        } catch (error) { console.error("[chat] stream failure", error); controller.error(error); }
      },
      cancel() { upstream.body?.cancel().catch(() => undefined); },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Chat-Mode": "ai", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return NextResponse.json({ error: timedOut ? "The assistant timed out. Please retry." : "The assistant could not connect." }, { status: timedOut ? 504 : 502 });
  }
}

