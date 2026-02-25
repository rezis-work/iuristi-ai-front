import { History, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { ConversationSummary } from "../lib/types";

type ChatHistorySidebarProps = {
  items: ConversationSummary[];
  activeConversationId?: string;
  isHistoryLoading: boolean;
  isDeletePending: boolean;
  deletingId?: string;
  onStartNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
};

function formatRelativeDate(updatedAt: number): string {
  return new Intl.DateTimeFormat("ka-GE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(updatedAt));
}

export function ChatHistorySidebar({
  items,
  activeConversationId,
  isHistoryLoading,
  isDeletePending,
  deletingId,
  onStartNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ChatHistorySidebarProps) {
  return (
    <aside className="w-full rounded-3xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-2xl shadow-black/40 md:sticky md:top-6 md:max-h-[76vh]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200">
          <History className="h-4 w-4 text-[#ff9D4D]" />
          <h3 className="text-sm font-semibold tracking-wide">ისტორია</h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onStartNewChat}
          className="rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          ახალი
        </Button>
      </div>

      <div className="space-y-2 overflow-y-auto md:max-h-[64vh] md:pr-1">
        {items.length === 0 && (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-400">
            ჯერ ისტორია არ არის. პირველი დიალოგის დასრულების შემდეგ აქ გამოჩნდება.
          </p>
        )}

        {items.map((item) => {
          const isActive = item.id === activeConversationId;
          const isCurrentDeleting = deletingId === item.id;
          const title = item.title?.trim() || item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border px-2.5 py-2 ${
                isActive
                  ? "border-[#ff9D4D]/60 bg-[#ff9D4D]/10 shadow-lg shadow-[#ff9D4D]/10"
                  : "border-zinc-800 bg-zinc-900/70"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectConversation(item.id)}
                disabled={isHistoryLoading}
                className="w-full cursor-pointer text-left"
              >
                <p className="truncate text-sm font-medium text-zinc-200">{title}</p>
                <p className="truncate text-[11px] text-zinc-500">{item.id}</p>
                <p className="text-[11px] text-zinc-500">{formatRelativeDate(item.updatedAt)}</p>
              </button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isDeletePending || isCurrentDeleting}
                onClick={() => onDeleteConversation(item.id)}
                className="mt-2 h-7 w-full justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-red-300"
              >
                {isCurrentDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    იშლება...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    წაშლა
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
