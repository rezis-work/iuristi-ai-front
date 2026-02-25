export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationSummary = {
  id: string;
  updatedAt: number;
  title?: string;
};
