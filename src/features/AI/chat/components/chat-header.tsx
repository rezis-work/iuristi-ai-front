import Link from "next/link";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function ChatHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-linear-to-r from-zinc-900 to-zinc-950 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ff9D4D]/25 bg-[#ff9D4D]/15 text-[#ff9D4D] shadow-lg shadow-[#ff9D4D]/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">AI ჩათი</h2>
            <p className="text-xs text-zinc-400 sm:text-sm">
              დასვი კითხვა და მიიღე სწრაფი, ზუსტი პასუხი რეალურ დროში
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800"
          >
            <Link href="/" className="text-white hover:text-yellow-700">
              <Home className="h-3.5 w-3.5 text-[#ff9D4D]" />
              მთავარი
            </Link>
          </Button>
          <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-zinc-300 sm:text-xs">
            Pro Assistant
          </div>
        </div>
      </div>
    </header>
  );
}
