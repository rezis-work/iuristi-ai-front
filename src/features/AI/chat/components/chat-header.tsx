import Link from "next/link";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function ChatHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-900/65 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">AI Legal Assistant</h2>
          
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/70 px-2.5 py-1 text-[11px] text-zinc-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
          <Button
            asChild
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-zinc-700 bg-zinc-800/70 text-zinc-100 hover:bg-zinc-700 hover:text-white"
          >
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
              მთავარი
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
