import { z } from "zod";

export const MAX_CHAT_MESSAGE = 1200;
export const MAX_CONVERSATION_MESSAGES = 16;

export const chatRequestSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(MAX_CHAT_MESSAGE) }))
    .min(1)
    .max(MAX_CONVERSATION_MESSAGES),
});

