import { HISTORY_STORAGE_KEY } from "./constants";
import type { ChatMessage, ConversationSummary } from "../lib/types";

type UnknownObject = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownObject {
  return typeof value === "object" && value !== null;
}


function normalizeMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) return null;

  const rawRole = value.role;
  const rawContent =
    typeof value.content === "string"
      ? value.content
      : typeof value.message === "string"
        ? value.message
        : typeof value.text === "string"
          ? value.text
          : null;

  if (!rawContent) return null;

  const normalizedRole =
    rawRole === "user" || rawRole === "human"
      ? "user"
      : rawRole === "assistant" || rawRole === "ai" || rawRole === "bot"
        ? "assistant"
        : null;

  if (!normalizedRole) return null;

  return { role: normalizedRole, content: rawContent };
}

function readMessageArray(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  const normalized = value.map(normalizeMessage).filter((item): item is ChatMessage => item !== null);
  return normalized.filter((message, index, items) => {
    const prev = items[index - 1];
    // Protect UI from backend payloads that occasionally repeat the same message twice.
    return !prev || prev.role !== message.role || prev.content !== message.content;
  });
}

export function parseHistoryResponse(payload: unknown): ChatMessage[] {
  const directArray = readMessageArray(payload);
  if (directArray.length) return directArray;

  if (!isRecord(payload)) return [];

  const candidates: unknown[] = [
    payload.history,
    payload.messages,
    payload.conversation,
    payload.data,
  ];

  for (const candidate of candidates) {
    const candidateAsMessages = readMessageArray(candidate);
    if (candidateAsMessages.length) return candidateAsMessages;

    if (!isRecord(candidate)) continue;
    const nestedHistory = readMessageArray(candidate.history);
    if (nestedHistory.length) return nestedHistory;

    const nestedMessages = readMessageArray(candidate.messages);
    if (nestedMessages.length) return nestedMessages;
  }

  return [];
}

export function loadConversationSummaries(): ConversationSummary[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is ConversationSummary => {
        if (!isRecord(item)) return false;
        return typeof item.id === "string" && typeof item.updatedAt === "number";
      })
      .map((item) => ({
        id: item.id,
        updatedAt: item.updatedAt,
        title: typeof item.title === "string" ? item.title : undefined,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function sanitizeTitle(title?: string): string | undefined {
  const trimmed = title?.trim();
  if (!trimmed) return undefined;
  return trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
}

export function upsertConversationSummary(conversationId: string, title?: string): ConversationSummary[] {
  const existing = loadConversationSummaries();
  const current = existing.find((item) => item.id === conversationId);
  const withoutCurrent = existing.filter((item) => item.id !== conversationId);
  const nextTitle = sanitizeTitle(title) ?? current?.title;
  const updated: ConversationSummary[] = [
    { id: conversationId, updatedAt: Date.now(), ...(nextTitle ? { title: nextTitle } : {}) },
    ...withoutCurrent,
  ];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function removeConversationSummary(conversationId: string): ConversationSummary[] {
  const updated = loadConversationSummaries().filter((item) => item.id !== conversationId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
