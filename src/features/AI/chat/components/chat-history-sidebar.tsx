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
    <aside className="flex h-full min-h-0 flex-col">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onStartNewChat}
        className="mb-3 h-10 w-full justify-start rounded-xl border-zinc-700 bg-zinc-800/70 text-zinc-100 hover:bg-zinc-700 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        ახალი ჩატი
      </Button>

      <div className="mb-2 flex items-center gap-2 px-1 text-xs text-zinc-400">
        <History className="h-3.5 w-3.5" />
        ბოლო საუბრები
      </div>

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {items.length === 0 && (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-500">
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
              className={`rounded-xl border px-2 py-2 transition-colors ${
                isActive
                  ? "border-zinc-600 bg-zinc-700/40"
                  : "border-zinc-800 bg-zinc-900/70 hover:bg-zinc-800/70"
              }`}
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => onSelectConversation(item.id)}
                  disabled={isHistoryLoading}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <p className="truncate text-sm text-zinc-200">{title}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{formatRelativeDate(item.updatedAt)}</p>
                </button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={isDeletePending || isCurrentDeleting}
                  onClick={() => onDeleteConversation(item.id)}
                  className="h-7 w-7 shrink-0 rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-red-300"
                >
                  {isCurrentDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 px-1 text-[11px] text-zinc-500">Shift + Enter ახალი ხაზი</p>
    </aside>
  );
}
