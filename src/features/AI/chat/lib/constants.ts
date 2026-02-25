import type { ChatMessage } from "../lib/types";

export const HISTORY_STORAGE_KEY = "ai-chat-conversations";

export const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "გამარჯობა! მე ვარ AI ასისტენტი. მომწერე შეკითხვა და მაქსიმალურად ზუსტ პასუხს მოგცემ.",
};
