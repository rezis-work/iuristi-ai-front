"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useAiChat, useAiChatStream, useDeleteConversation, useGetConversationHistory } from "../hook/chat";
import type { ChatRequestSchema } from "../schemas/chat-schema";
import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatHistorySidebar } from "./chat-history-sidebar";
import { ChatMessages } from "./chat-messages";
import { INITIAL_MESSAGE } from "../lib/constants";
import {
  loadConversationSummaries,
  parseHistoryResponse,
  removeConversationSummary,
  upsertConversationSummary,
} from "../lib/history-utils";
import type { ChatMessage, ConversationSummary } from "../lib/types";

export default function AIChatPage() {
  const { mutateAsync: sendChat, isPending: isChatPending, error: chatError } = useAiChat();
  const {
    mutateAsync: sendChatStream,
    isPending: isStreamPending,
    error: streamError,
  } = useAiChatStream();
  const { mutateAsync: deleteConversation, isPending: isDeletePending } = useDeleteConversation();

  const [conversationId, setConversationId] = useState<string | undefined>();
  const [historyConversationId, setHistoryConversationId] = useState<string | undefined>();
  const [deletingId, setDeletingId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [conversationItems, setConversationItems] = useState<ConversationSummary[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeRequestIdRef = useRef(0);
  const assistantBufferRef = useRef("");
  const hasAssistantMessageRef = useRef(false);
  const flushRafRef = useRef<number | null>(null);

  const { data: historyData, isFetching: isHistoryLoading, refetch: refetchHistory } =
    useGetConversationHistory(historyConversationId);

  const isPending = isChatPending || isStreamPending;
  const error = chatError || streamError;

  useEffect(() => {
    setConversationItems(loadConversationSummaries());
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    setConversationItems(upsertConversationSummary(conversationId));
  }, [conversationId]);

  useEffect(() => {
    if (!historyConversationId) return;
    if (typeof historyData === "undefined") return;
    const historyMessages = parseHistoryResponse(historyData);
    setMessages(historyMessages.length ? historyMessages : [INITIAL_MESSAGE]);
    setConversationId(historyConversationId);
  }, [historyConversationId, historyData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const invalidateActiveStream = () => {
    activeRequestIdRef.current += 1;
    assistantBufferRef.current = "";
    hasAssistantMessageRef.current = false;
    if (flushRafRef.current !== null) {
      cancelAnimationFrame(flushRafRef.current);
      flushRafRef.current = null;
    }
  };

  const flushAssistantBuffer = (requestId: number) => {
    if (activeRequestIdRef.current !== requestId) return;
    const buffered = assistantBufferRef.current;
    if (!buffered) return;
    assistantBufferRef.current = "";

    setMessages((prev) => {
      if (activeRequestIdRef.current !== requestId) return prev;
      const next = [...prev];
      const last = next[next.length - 1];

      if (!hasAssistantMessageRef.current || last?.role !== "assistant") {
        next.push({ role: "assistant", content: buffered });
        hasAssistantMessageRef.current = true;
        return next;
      }

      next[next.length - 1] = {
        ...last,
        content: `${last.content}${buffered}`,
      };
      return next;
    });
  };

  const scheduleAssistantFlush = (requestId: number) => {
    if (flushRafRef.current !== null) return;
    flushRafRef.current = requestAnimationFrame(() => {
      flushRafRef.current = null;
      flushAssistantBuffer(requestId);
    });
  };

  const resetToNewChat = () => {
    invalidateActiveStream();
    setConversationId(undefined);
    setHistoryConversationId(undefined);
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  const handleSelectConversation = async (selectedId: string) => {
    invalidateActiveStream();
    setConversationId(selectedId);
    setHistoryConversationId(selectedId);
    if (selectedId === historyConversationId) {
      await refetchHistory();
    }
  };

  const handleDeleteConversation = async (selectedId: string) => {
    try {
      setDeletingId(selectedId);
      await deleteConversation(selectedId);
      const updatedSummaries = removeConversationSummary(selectedId);
      setConversationItems(updatedSummaries);

      if (selectedId === conversationId || selectedId === historyConversationId) {
        const nextConversation = updatedSummaries[0];
        if (nextConversation) {
          setConversationId(nextConversation.id);
          setHistoryConversationId(nextConversation.id);
        } else {
          resetToNewChat();
        }
      }
    } finally {
      setDeletingId(undefined);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmedInput }];
    setMessages(nextMessages);
    setInput("");

    const payload: ChatRequestSchema = {
      message: trimmedInput,
      conversationId,
      // `message` already contains the latest user text.
      // Sending it again inside `history` duplicates user entries in stored conversations.
      history: messages.map(({ role, content }) => ({ role, content })),
      options: { stream: true },
    };
    const shouldSetInitialTitle = !conversationId;
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    assistantBufferRef.current = "";
    hasAssistantMessageRef.current = false;
    if (flushRafRef.current !== null) {
      cancelAnimationFrame(flushRafRef.current);
      flushRafRef.current = null;
    }
    const applyNonStreamResponse = async () => {
      const response = await sendChat({ ...payload, options: { stream: false } });
      if (activeRequestIdRef.current !== requestId) return;
      if (response.conversationId) {
        setConversationId(response.conversationId);
        setHistoryConversationId(response.conversationId);
        if (shouldSetInitialTitle) {
          setConversationItems(upsertConversationSummary(response.conversationId, trimmedInput));
        }
      }

      const historyMessages = parseHistoryResponse(response);
      if (historyMessages.length) {
        setMessages(historyMessages);
        return;
      }

      if (response.content?.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: response.content }]);
      }
    };

    try {
      let streamHadToken = false;

      await sendChatStream({
        data: payload,
        onEvent: (event) => {
          if (activeRequestIdRef.current !== requestId) return;

          if (event.type === "error") {
            flushAssistantBuffer(requestId);
            const message =
              event.data?.error?.trim() || "ამ ეტაპზე პასუხის მიღება ვერ მოხერხდა. სცადე თავიდან.";
            setMessages((prev) => [...prev, { role: "assistant", content: message }]);
            streamHadToken = true;
            return;
          }

          if (event.type === "done") {
            flushAssistantBuffer(requestId);
            if (event.data?.conversationId) {
              setConversationId(event.data.conversationId);
              setHistoryConversationId(event.data.conversationId);
              if (shouldSetInitialTitle) {
                setConversationItems(upsertConversationSummary(event.data.conversationId, trimmedInput));
              }
            }
            return;
          }

          if (event.type !== "token") return;
          const token = event.data?.content ?? "";
          if (!token) return;
          streamHadToken = true;
          assistantBufferRef.current += token;
          scheduleAssistantFlush(requestId);
        },
      });

      flushAssistantBuffer(requestId);
      // Fallback: if stream endpoint returned without token events.
      if (!streamHadToken) {
        await applyNonStreamResponse();
      }
    } catch {
      // If streaming endpoint is unavailable in production, fallback to regular chat response.
      try {
        await applyNonStreamResponse();
      } catch {
        // Inline error state and toast are handled by mutation error callbacks.
      }
      return;
    }
  };

  useEffect(() => {
    return () => {
      if (flushRafRef.current !== null) {
        cancelAnimationFrame(flushRafRef.current);
      }
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1320px] px-3 pb-5 pt-[84px] sm:px-5 sm:pt-[96px] lg:px-8 lg:pt-[100px]">
      <div className="pb-1">
        <div className="grid min-w-0 grid-cols-1 gap-4 min-[1000px]:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 overflow-hidden rounded-3xl border border-zinc-800/90 bg-zinc-950/90 shadow-2xl shadow-black/40 backdrop-blur">
            <ChatHeader />
            <div className="flex min-h-[60dvh] flex-col min-[1000px]:min-h-[68vh]">
              <ChatMessages
                messages={messages}
                isPending={isPending || isHistoryLoading}
                messagesEndRef={messagesEndRef}
              />
              <ChatComposer
                input={input}
                isPending={isPending || isHistoryLoading}
                hasError={!!error}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
          <ChatHistorySidebar
            items={conversationItems}
            activeConversationId={historyConversationId ?? conversationId}
            isHistoryLoading={isHistoryLoading}
            isDeletePending={isDeletePending}
            deletingId={deletingId}
            onStartNewChat={resetToNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>
      </div>
    </section>
  );
}
