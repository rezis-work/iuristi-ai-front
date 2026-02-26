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

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function getApiBaseUrl(): string {
  return normalizeBaseUrl((process.env.NEXT_PUBLIC_API_URL ?? "/api").trim());
}

function getChatFallbackBaseUrl(): string | null {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl.endsWith("/api")) return null;
  return baseUrl.slice(0, -4);
}

function buildChatUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

function shouldRetryOnFallback(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("404") || message.includes("NOT_FOUND");
}

async function postChatFallback(data: ChatRequestSchema): Promise<ChatResponse> {
  const fallbackBase = getChatFallbackBaseUrl();
  if (fallbackBase === null) {
    throw new Error("Chat fallback URL is not available");
  }

  const token = getToken();
  const response = await fetch(buildChatUrl(fallbackBase, "/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ChatResponse;
}

async function chatRequestFallback<T>(path: string, method: "GET" | "DELETE"): Promise<T> {
  const fallbackBase = getChatFallbackBaseUrl();
  if (fallbackBase === null) {
    throw new Error("Chat fallback URL is not available");
  }

  const token = getToken();
  const response = await fetch(buildChatUrl(fallbackBase, path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status} ${response.statusText}`);
  }

  if (method === "DELETE") {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function chatWithAI(data: ChatRequestSchema): Promise<ChatResponse> {
  try {
    return await api<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    });
  } catch (error) {
    if (shouldRetryOnFallback(error)) {
      try {
        return await postChatFallback(data);
      } catch (fallbackError) {
        console.error("Failed to chat with AI via fallback", fallbackError);
      }
    }
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
    const baseUrl = getApiBaseUrl();
    const token = getToken();
    const fallbackBase = getChatFallbackBaseUrl();
    const streamUrls = [
      buildChatUrl(baseUrl, "/chat/stream"),
      ...(fallbackBase !== null ? [buildChatUrl(fallbackBase, "/chat/stream")] : []),
    ];
    let response: Response | null = null;

    for (let index = 0; index < streamUrls.length; index += 1) {
      const streamUrl = streamUrls[index];
      response = await fetch(streamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const shouldTryNext = response.status === 404 && index < streamUrls.length - 1;
      if (!shouldTryNext) break;
    }

    if (!response) {
      throw new Error("Stream request failed before receiving response");
    }

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
    if (shouldRetryOnFallback(error)) {
      try {
        return await chatRequestFallback<unknown>(`/chat/conversations/${conversationId}`, "GET");
      } catch (fallbackError) {
        console.error("Failed to get conversation history via fallback", fallbackError);
      }
    }
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
    if (shouldRetryOnFallback(error)) {
      try {
        await chatRequestFallback<void>(`/chat/conversations/${conversationId}`, "DELETE");
        return;
      } catch (fallbackError) {
        console.error("Failed to delete conversation via fallback", fallbackError);
      }
    }
    console.error("Failed to delete conversation", error);
    throw error;
  }
}