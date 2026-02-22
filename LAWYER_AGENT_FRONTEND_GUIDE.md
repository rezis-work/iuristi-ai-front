# Lawyer Agent — Frontend Implementation Guide

Complete guide for implementing the AI-powered Georgian law assistant features in the iuristi-ai-front Next.js application.

---

## Table of Contents

1. [Overview](#overview)
2. [API Base URL & Routing](#api-base-url--routing)
3. [Feature 1: Semantic Law Search](#feature-1-semantic-law-search)
4. [Feature 2: AI Chat with Legal Assistant](#feature-2-ai-chat-with-legal-assistant)
5. [Feature 3: Collection Stats (Optional)](#feature-3-collection-stats-optional)
6. [Feature 4: Ingest API (Admin Only)](#feature-4-ingest-api-admin-only)
7. [TypeScript Types](#typescript-types)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## Overview

The **Lawyer Agent** is an AI-powered Georgian law assistant that:

- **Searches** Georgian legislation (Civil Code, Administrative Code) using semantic search
- **Chats** with users in Georgian or English, citing specific articles and sources
- **Streams** responses in real-time via Server-Sent Events (SSE)

**Data source**: 1582+ legal articles from matsne.gov.ge (Civil Code + Administrative Code) stored in Qdrant vector database.

**Backend**: Express service at `/api/agent/` (proxied by nginx from `https://iuristi.online/api/agent/`).

---

## API Base URL & Routing

The frontend uses `NEXT_PUBLIC_API_URL` for API calls. In production this is `https://iuristi.online/api`.

| Environment | Base URL                     | Agent Base                                   |
| ----------- | ---------------------------- | -------------------------------------------- |
| Production  | `https://iuristi.online/api` | `https://iuristi.online/api/agent`           |
| Development | `http://localhost:3001`      | Use backend proxy or `http://localhost:3002` |

**Important**: The Lawyer Agent is served at `/api/agent/`. All agent endpoints are prefixed with `/agent/` relative to the API base.

The existing `api()` helper in `src/lib/api.ts` uses `NEXT_PUBLIC_API_URL` (e.g. `https://iuristi.online/api`). Use path `/agent/search`, `/agent/chat`, etc. — they will resolve to the correct agent endpoints.

```typescript
// Paths are relative to BASE_URL (which already includes /api)
api("/agent/search", {
  method: "POST",
  body: JSON.stringify({ query: "..." }),
});
// Fetches: https://iuristi.online/api/agent/search (production)
```

**Development**: If running locally, ensure your backend or proxy routes `/api/agent/` to the lawyer-agent service (port 3002). Otherwise use the production URL for testing.

---

## Feature 1: Semantic Law Search

Direct semantic search over the legal database. **No authentication required.**

### Endpoint

```
POST /api/agent/search
```

### Request Body

```typescript
interface SearchRequest {
  query: string; // Required. Search query (Georgian or English)
  lawCode?: string; // Optional. Filter: "civil" | "administrative"
  chapter?: string; // Optional. Filter by chapter
  topK?: number; // Optional. Number of results (default: 5)
  scoreThreshold?: number; // Optional. Min similarity 0-1 (default: 0.65)
}
```

### Response

```typescript
interface SearchResult {
  id: string;
  score: number;
  articleNumber: string; // e.g. "მუხლი 150"
  lawTitle: string; // e.g. "საქართველოს სამოქალაქო კოდექსი"
  chapter?: string;
  text: string;
  sourceUrl: string; // matsne.gov.ge URL
}
```

### Example Implementation

```typescript
// src/features/lawyer-agent/api/search.ts
import { api } from "@/src/lib/api";

const AGENT_BASE = "/agent";

export interface SearchRequest {
  query: string;
  lawCode?: "civil" | "administrative";
  chapter?: string;
  topK?: number;
  scoreThreshold?: number;
}

export interface SearchResult {
  id: string;
  score: number;
  articleNumber: string;
  lawTitle: string;
  chapter?: string;
  text: string;
  sourceUrl: string;
}

export async function searchLaw(
  params: SearchRequest
): Promise<SearchResult[]> {
  return api<SearchResult[]>(`${AGENT_BASE}/search`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}
```

### UI Suggestions

- Search input with debounce (300–500ms)
- Optional filters: law code dropdown, chapter input
- Results list with article number, law title, excerpt, and "View source" link
- Highlight relevance score (e.g. badge or progress bar)

---

## Feature 2: AI Chat with Legal Assistant

Chat with the AI lawyer that searches the law database and cites sources. **No authentication required.**

### Endpoints

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| POST   | `/api/agent/chat`                   | One-shot response (no streaming) |
| POST   | `/api/agent/chat/stream`            | **SSE streaming** (recommended)  |
| GET    | `/api/agent/chat/conversations/:id` | Get conversation history         |
| DELETE | `/api/agent/chat/conversations/:id` | Delete conversation              |

### Request Body (Chat)

```typescript
interface ChatRequest {
  message: string; // Required. User message
  conversationId?: string; // Optional. UUID for multi-turn
  history?: { role: "user" | "assistant"; content: string }[];
  options?: {
    lawCodes?: string[]; // Optional. Filter laws
    stream?: boolean;
  };
}
```

### Response (Non-Streaming)

```typescript
interface ChatResponse {
  content: string; // AI response text
  sources: {
    articleNumber: string;
    lawTitle: string;
    sourceUrl: string;
    relevanceScore: number;
  }[];
  toolsUsed: string[];
  conversationId: string;
}
```

### SSE Streaming Events

When using `POST /api/agent/chat/stream`, the response is `text/event-stream`:

| Event        | Data                 | Description                            |
| ------------ | -------------------- | -------------------------------------- |
| `tool_start` | `{ tool, args }`     | Agent started a tool (e.g. search_law) |
| `tool_done`  | `{ tool, results }`  | Tool finished                          |
| `token`      | `{ content }`        | Chunk of AI response text              |
| `sources`    | `Source[]`           | Final sources array                    |
| `done`       | `{ conversationId }` | Stream complete                        |
| `error`      | `{ error }`          | Error occurred                         |

### Example: Non-Streaming Chat

```typescript
// src/features/lawyer-agent/api/chat.ts
import { api } from "@/src/lib/api";

const AGENT_BASE = "/agent";

export interface ChatRequest {
  message: string;
  conversationId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  content: string;
  sources: {
    articleNumber: string;
    lawTitle: string;
    sourceUrl: string;
    relevanceScore: number;
  }[];
  toolsUsed: string[];
  conversationId: string;
}

export async function sendChatMessage(
  params: ChatRequest
): Promise<ChatResponse> {
  return api<ChatResponse>(`${AGENT_BASE}/chat`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}
```

### Example: SSE Streaming Chat

```typescript
// src/features/lawyer-agent/api/chat-stream.ts
import { getToken } from "@/src/lib/api";

const AGENT_BASE = "/agent";

export type StreamEvent =
  | { type: "tool_start"; tool: string; args: unknown }
  | { type: "tool_done"; tool: string; results: unknown }
  | { type: "token"; content: string }
  | { type: "sources"; sources: unknown[] }
  | { type: "done"; conversationId: string }
  | { type: "error"; error: string };

export async function streamChat(
  params: {
    message: string;
    conversationId?: string;
    history?: { role: string; content: string }[];
  },
  onEvent: (event: StreamEvent) => void
): Promise<string> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  const res = await fetch(`${baseUrl}${AGENT_BASE}/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error(await res.text());

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let conversationId = "";

  if (!reader) throw new Error("No response body");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const block of lines) {
      const [eventLine, dataLine] = block.split("\n");
      const eventMatch = eventLine?.match(/^event: (.+)$/);
      const dataMatch = dataLine?.match(/^data: (.+)$/);
      if (!eventMatch || !dataMatch) continue;

      const eventType = eventMatch[1];
      const data = JSON.parse(dataMatch[1]);

      if (eventType === "token")
        onEvent({ type: "token", content: data.content });
      else if (eventType === "sources")
        onEvent({ type: "sources", sources: data });
      else if (eventType === "done") {
        conversationId = data.conversationId;
        onEvent({ type: "done", conversationId });
      } else if (eventType === "error")
        onEvent({ type: "error", error: data.error });
    }
  }

  return conversationId;
}
```

### UI Suggestions

- Chat interface: message list + input
- For streaming: append `token` chunks to the last assistant message
- Show "Searching..." when `tool_start` (search_law) is received
- Display sources as clickable cards/links below the response
- Store `conversationId` for multi-turn (e.g. in React state or URL)

---

## Feature 3: Collection Stats (Optional)

Get the number of indexed legal articles. Useful for a "Database status" badge.

### Endpoint

```
GET /api/agent/search/collections/stats
```

### Response

```typescript
{
  pointsCount: number;
  indexedVectorsCount: number;
  status: string;
}
```

### Example

```typescript
export async function getCollectionStats() {
  return api<{
    pointsCount: number;
    indexedVectorsCount: number;
    status: string;
  }>("/agent/search/collections/stats");
}
```

---

## Feature 4: Ingest API (Admin Only)

**Requires authentication.** For admins to upload or reindex laws.

### Endpoints

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| POST   | `/api/agent/ingest/upload`   | Upload new law (JSON)         |
| POST   | `/api/agent/ingest/reindex`  | Reindex existing law          |
| GET    | `/api/agent/ingest/status`   | Collection stats per law_code |
| DELETE | `/api/agent/ingest/:lawCode` | Delete law from DB            |

### Upload Request

```typescript
interface IngestUploadRequest {
  lawCode: "civil" | "administrative";
  sourceUrl: string; // matsne.gov.ge URL
  markdown: string; // Full law text
  metadata?: { title?: string; sourceURL?: string; documentId?: string };
}
```

### Authentication

All ingest endpoints require `Authorization: Bearer <JWT>`. Use the existing `api()` helper with `auth: true`:

```typescript
import { api } from "@/src/lib/api";

export async function uploadLaw(data: IngestUploadRequest) {
  return api("/agent/ingest/upload", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}
```

---

## TypeScript Types

Create a shared types file:

```typescript
// src/features/lawyer-agent/types.ts

export interface SearchRequest {
  query: string;
  lawCode?: "civil" | "administrative";
  chapter?: string;
  topK?: number;
  scoreThreshold?: number;
}

export interface SearchResult {
  id: string;
  score: number;
  articleNumber: string;
  lawTitle: string;
  chapter?: string;
  text: string;
  sourceUrl: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface Source {
  articleNumber: string;
  lawTitle: string;
  sourceUrl: string;
  relevanceScore: number;
}

export interface ChatResponse {
  content: string;
  sources: Source[];
  toolsUsed: string[];
  conversationId: string;
}
```

---

## Error Handling

- **400**: Invalid request (e.g. empty query). Show validation message.
- **401**: Unauthorized (ingest only). Redirect to login if using `api()` with `auth: true`.
- **503**: Service degraded (e.g. Qdrant down). Show "Service temporarily unavailable".
- **SSE error event**: Stream error. Show error message, allow retry.

---

## Testing

### Health Check

```bash
curl https://iuristi.online/api/agent/health
```

### Search

```bash
curl -X POST https://iuristi.online/api/agent/search \
  -H "Content-Type: application/json" \
  -d '{"query": "კონტრაქტის გაუქმება", "topK": 5}'
```

### Chat (Postman)

- **POST** `https://iuristi.online/api/agent/chat`
- **Body** (raw JSON): `{"message": "რა არის კონტრაქტის გაუქმების პირობები?"}`

---

## Summary

| Feature             | Endpoint                             | Auth | Use Case             |
| ------------------- | ------------------------------------ | ---- | -------------------- |
| Search              | POST /agent/search                   | No   | Direct law search UI |
| Chat                | POST /agent/chat                     | No   | One-shot Q&A         |
| Chat Stream         | POST /agent/chat/stream              | No   | Real-time chat UI    |
| Get Conversation    | GET /agent/chat/conversations/:id    | No   | Load history         |
| Delete Conversation | DELETE /agent/chat/conversations/:id | No   | Clear chat           |
| Collection Stats    | GET /agent/search/collections/stats  | No   | Status badge         |
| Ingest Upload       | POST /agent/ingest/upload            | Yes  | Admin law upload     |
| Ingest Status       | GET /agent/ingest/status             | Yes  | Admin dashboard      |

---

## Next Steps

1. Create `src/features/lawyer-agent/` feature folder
2. Add API functions (`search.ts`, `chat.ts`, `chat-stream.ts`)
3. Build Search UI component (input + results list)
4. Build Chat UI component (messages + input, with optional streaming)
5. Add route(s), e.g. `/law-assistant` or integrate into existing pages
6. (Optional) Add admin ingest UI for authenticated users
