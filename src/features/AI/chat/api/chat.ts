import { api, getToken } from "@/src/lib/api";
import { ChatRequestSchema } from "../schemas/chat-schema";

type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  message: string;
  conversationId?: string;
  history: ChatHistoryItem[];
  options?: {
    lawCodes?: string[];
    stream?: boolean;
  };
};

type SSEToolStartEvent = {
  type: "tool_start";
  data: {
    tool: string;
    args: unknown;
  };
};

type SSEToolDoneEvent = {
  type: "tool_done";
  data: {
    tool: string;
    results: unknown;
  };
};

type SSETokenEvent = {
  type: "token";
  data: {
    content: string;
  };
};

type SSESourcesEvent = {
  type: "sources";
  data: unknown;
};

type SSEDoneEvent = {
  type: "done";
  data: {
    conversationId?: string;
    message?: string;
  };
};

type SSEErrorEvent = {
  type: "error";
  data: {
    error: string;
  };
};

export type ChatStreamEvent =
  | SSEToolStartEvent
  | SSEToolDoneEvent
  | SSETokenEvent
  | SSESourcesEvent
  | SSEDoneEvent
  | SSEErrorEvent;

export async function chatWithAI(data: ChatRequestSchema): Promise<ChatResponse> {
  try {
    return await api<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    });
  } catch (error) {
    console.error("Failed to chat with AI", error);
    throw error;
  }
}

function emitStreamEvent(
  eventName: string,
  payload: unknown,
  onEvent: (event: ChatStreamEvent) => void,
) {
  switch (eventName) {
    case "tool_start":
      onEvent({ type: "tool_start", data: payload as SSEToolStartEvent["data"] });
      return;
    case "tool_done":
      onEvent({ type: "tool_done", data: payload as SSEToolDoneEvent["data"] });
      return;
    case "token":
      if (typeof payload === "string") {
        onEvent({ type: "token", data: { content: payload } });
        return;
      }
      onEvent({ type: "token", data: payload as SSETokenEvent["data"] });
      return;
    case "sources":
      onEvent({ type: "sources", data: payload });
      return;
    case "done":
      onEvent({ type: "done", data: payload as SSEDoneEvent["data"] });
      return;
    case "error":
      onEvent({ type: "error", data: payload as SSEErrorEvent["data"] });
      return;
    default:
      return;
  }
}

function parseSSEChunk(chunk: string, onEvent: (event: ChatStreamEvent) => void) {
  const lines = chunk.split(/\r?\n/);
  let eventName = "";
  const dataParts: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
      continue;
    }
    if (line.startsWith("data:")) {
      dataParts.push(line.slice("data:".length).trim());
    }
  }

  if (!eventName || dataParts.length === 0) return;

  const raw = dataParts.join("\n");
  let payload: unknown = raw;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = raw;
  }

  emitStreamEvent(eventName, payload, onEvent);
}

export async function streamEvent(
  data: ChatRequestSchema,
  onEvent: (event: ChatStreamEvent) => void,
): Promise<void> {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "/api").trim();
    const token = getToken();
    const response = await fetch(`${baseUrl}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Stream response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const normalized = buffer.replace(/\r\n/g, "\n");
      const chunks = normalized.split("\n\n");
      const trailingChunk = chunks.pop() ?? "";

      for (const chunk of chunks) {
        if (chunk.trim()) {
          parseSSEChunk(chunk, onEvent);
        }
      }
      buffer = trailingChunk;
    }

    if (buffer.trim()) {
      parseSSEChunk(buffer, onEvent);
    }
  } catch (error) {
    console.error("Failed to stream event", error);
    throw error;
  }
}

export async function getConversationHistory(conversationId: string) {
  try {
    return await api<unknown>(`/chat/conversations/${conversationId}`, {
      method: "GET",
      auth: true,
    });
  } catch (error) {
    console.error("Failed to get conversation history", error);
    throw error;
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    return await api<void>(`/chat/conversations/${conversationId}`, {
      method: "DELETE",
      auth: true,
    });
  } catch (error) {
    console.error("Failed to delete conversation", error);
    throw error;
  }
}