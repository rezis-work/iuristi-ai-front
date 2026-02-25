import { FormEvent, KeyboardEvent } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

type ChatComposerProps = {
  input: string;
  isPending: boolean;
  hasError: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatComposer({
  input,
  isPending,
  hasError,
  onInputChange,
  onSubmit,
}: ChatComposerProps) {
  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    if (event.shiftKey) return;
    if (isPending || !input.trim()) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="border-t border-zinc-800/90 bg-zinc-950/95 p-4 sm:p-5">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/80 p-2 shadow-inner shadow-black/30">
          <div className="mb-1 flex items-center gap-2 px-2 pt-1 text-[11px] text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-[#ff9D4D]" />
            დაწერე რაც შეიძლება კონკრეტულად, რომ ზუსტი პასუხი მიიღო
          </div>
          <Textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="მაგ: შრომითი ხელშეკრულების შეწყვეტის შემთხვევაში რა ვადებია?"
            className="min-h-[95px] resize-none border-0 bg-transparent text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
            maxLength={5000}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">
              {input.length}/5000
            </span>
            <span className="text-xs text-zinc-500">Shift + Enter ახალი ხაზი</span>
          </div>
          <Button
            type="submit"
            disabled={isPending || !input.trim()}
            className="h-10 rounded-xl bg-[#ff9D4D] px-5 font-semibold text-black shadow-lg shadow-[#ff9D4D]/20 hover:bg-[#ff8D3D]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                იგზავნება...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                გაგზავნა
              </>
            )}
          </Button>
        </div>
        {hasError && (
          <p className="text-xs text-red-400">პასუხის მიღება ვერ მოხერხდა. გთხოვ, სცადე თავიდან.</p>
        )}
      </div>
    </form>
  );
}
