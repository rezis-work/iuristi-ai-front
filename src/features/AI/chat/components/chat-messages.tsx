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
    <div className="flex-1 overflow-y-auto bg-linear-to-b from-zinc-950 to-zinc-950/80 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div key={`${message.role}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[82%] ${
                  isUser
                    ? "bg-[#ff9D4D] text-black shadow-lg shadow-[#ff9D4D]/20"
                    : "border border-zinc-800 bg-zinc-900/95 text-zinc-100 shadow-lg shadow-black/20"
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-80">
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
                <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
              </div>
            </div>
          );
        })}

        {isPending && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/95 px-3 py-2 text-sm text-zinc-300 shadow-lg shadow-black/20">
              <Loader2 className="h-4 w-4 animate-spin text-[#ff9D4D]" />
              პასუხს ვამზადებ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
