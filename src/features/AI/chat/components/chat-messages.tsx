import { Bot, Loader2, User } from "lucide-react";
import type { RefObject } from "react";
import type { ChatMessage } from "../lib/types";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isPending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessages({ messages, isPending, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-900/20 px-3 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`w-full text-sm leading-relaxed ${isUser ? "max-w-[85%]" : "max-w-full"}`}>
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  {isUser ? (
                    <>
                      <User className="h-3.5 w-3.5" />
                      შენ
                    </>
                  ) : (
                    <>
                      <Bot className="h-3.5 w-3.5" />
                      AI
                    </>
                  )}
                </div>
                <div
                  className={
                    isUser
                      ? "rounded-2xl bg-zinc-700/80 px-4 py-3 text-zinc-100"
                      : "rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-zinc-100"
                  }
                >
                  <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}

        {isPending && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-300">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
              პასუხს ვამზადებ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
