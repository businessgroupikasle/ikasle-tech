import type { ChatRequestMessage } from "@/types/chatbot";
import { CHAT_SYSTEM_PROMPT } from "./knowledge";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export function chatbotConfig() {
  const enabled = process.env.CHATBOT_ENABLED !== "false";
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  const configured = enabled && provider === "openai" && Boolean(process.env.AI_API_KEY && process.env.AI_MODEL);
  return { enabled, provider, configured };
}

export async function createProviderResponse(messages: ChatRequestMessage[], signal: AbortSignal) {
  const timeout = AbortSignal.timeout(25_000);
  const combined = AbortSignal.any([signal, timeout]);
  return fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.AI_MODEL,
      instructions: CHAT_SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 500,
      store: false,
      stream: true,
    }),
    signal: combined,
  });
}

