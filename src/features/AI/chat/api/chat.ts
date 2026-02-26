import { api, getToken } from "@/src/lib/api";
import type { ChatRequestSchema } from "../schemas/chat-schema";

type Source = {
  articleNumber: string;
  lawTitle: string;
  sourceUrl: string;
  relevanceScore: number;
};

export type ChatResponse = {
  content: string;
  sources: Source[];
  toolsUsed: string[];
  conversationId: string;
};

export type StoredConversation = {
  id: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  lastResponse: {
    content: string;
    sources: Source[];
    toolsUsed: string[];
  };
  createdAt: string;
  updatedAt: string;
};

type SSEToolStartEvent = {
  type: "tool_start";
  data: { tool: string; args: Record<string, unknown> };
};

type SSEToolDoneEvent = {
  type: "tool_done";
  data: { tool: string; results: number };
};

type SSETokenEvent = {
  type: "token";
  data: { content: string };
};

type SSESourcesEvent = {
  type: "sources";
  data: Source[];
};

type SSEDoneEvent = {
  type: "done";
  data: { conversationId?: string };
};

type SSEErrorEvent = {
  type: "error";
  data: { error: string };
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

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function chatWithAI(data: ChatRequestSchema): Promise<ChatResponse> {
  return api<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

function emitStreamEvent(
  eventName: string,
  payload: unknown,
  onEvent: (event: ChatStreamEvent) => void,
): void {
  switch (eventName) {
    case "tool_start":
      onEvent({ type: "tool_start", data: payload as SSEToolStartEvent["data"] });
      return;
    case "tool_done":
      onEvent({ type: "tool_done", data: payload as SSEToolDoneEvent["data"] });
      return;
    case "token":
      onEvent({ type: "token", data: payload as SSETokenEvent["data"] });
      return;
    case "sources":
      onEvent({ type: "sources", data: payload as Source[] });
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

function parseSSEChunk(chunk: string, onEvent: (event: ChatStreamEvent) => void): void {
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
  try {
    emitStreamEvent(eventName, JSON.parse(raw), onEvent);
  } catch {
    emitStreamEvent(eventName, raw, onEvent);
  }
}

export async function streamChat(
  data: ChatRequestSchema,
  onEvent: (event: ChatStreamEvent) => void,
): Promise<void> {
  const token = getToken();
  const response = await fetch(buildUrl("/agent/chat/stream"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      if (chunk.trim()) parseSSEChunk(chunk, onEvent);
    }
  }

  if (buffer.trim()) {
    parseSSEChunk(buffer, onEvent);
  }
}

export async function getConversationHistory(
  conversationId: string,
): Promise<StoredConversation> {
  return api<StoredConversation>(`/agent/chat/conversations/${conversationId}`, {
    method: "GET",
    auth: true,
  });
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await api<void>(`/agent/chat/conversations/${conversationId}`, {
    method: "DELETE",
    auth: true,
  });
}