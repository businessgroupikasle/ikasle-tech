import type { ChatRequestMessage } from "@/types/chatbot";
import { CHAT_SYSTEM_PROMPT } from "./knowledge";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export function chatbotConfig() {
  const enabled = process.env.CHATBOT_ENABLED !== "false";
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  const configured =
    enabled &&
    ((provider === "openai" && Boolean(process.env.AI_API_KEY && process.env.AI_MODEL)) ||
      (provider === "nvidia" && Boolean(process.env.NVIDIA_API_KEY && process.env.NVIDIA_MODEL)));

  return { enabled, provider, configured };
}

export async function createProviderResponse(
  messages: ChatRequestMessage[],
  signal: AbortSignal,
) {
  const timeout = AbortSignal.timeout(25_000);
  const combined = AbortSignal.any([signal, timeout]);
  const { provider } = chatbotConfig();

  if (provider === "nvidia") {
    return fetch(NVIDIA_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL,
        messages: [
          { role: "system", content: CHAT_SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 300,
        stream: true,
        chat_template_kwargs: { enable_thinking: false },
        reasoning_budget: 0,
      }),
      signal: combined,
    });
  }

  return fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json",
    },
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
