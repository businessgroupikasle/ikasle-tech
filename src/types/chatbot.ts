export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  actions?: ChatAction[];
  error?: boolean;
};

export type ChatAction = { label: string; href?: string; prompt?: string; enquiry?: boolean };

export type ChatRequestMessage = Pick<ChatMessage, "role" | "content">;

