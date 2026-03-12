import { FormEvent, KeyboardEvent } from "react";
import { Loader2, Send } from "lucide-react";
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
    <form onSubmit={onSubmit} className="border-t border-zinc-800/80 bg-zinc-900/65 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <div className="rounded-[28px] border border-zinc-700/90 bg-zinc-800/80 p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors focus-within:border-zinc-500">
          <Textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="მაგ: შრომითი ხელშეკრულების შეწყვეტის შემთხვევაში რა ვადებია?"
            className="min-h-[72px] max-h-[220px] resize-none border-0 bg-transparent px-2 pt-2 text-[15px] leading-6 text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
            maxLength={5000}
          />
          <div className="mt-2 flex items-center justify-between gap-3 px-2 pb-1">
            <span className="text-xs text-zinc-500">{input.length}/5000 • Enter გასაგზავნად</span>
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !input.trim()}
              className="h-10 w-10 rounded-full bg-zinc-100 text-black shadow-md transition-all hover:scale-[1.03] hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {hasError && (
          <p className="text-xs text-red-400">პასუხის მიღება ვერ მოხერხდა. გთხოვ, სცადე თავიდან.</p>
        )}
      </div>
    </form>
  );
}
