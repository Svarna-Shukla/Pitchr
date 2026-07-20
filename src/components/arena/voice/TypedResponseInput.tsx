import { Send } from "lucide-react";

type Props = { value: string; onChange: (value: string) => void; onSubmit: () => void };

// Typed fallback response surface, reached via the "Switch to Type" toggle or automatically when the
// browser has no Web Speech API support at all
export default function TypedResponseInput({ value, onChange, onSubmit }: Props) {
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="...defend yourself"
        rows={2}
        className="min-h-[120px] w-full flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 sm:min-h-0 sm:rounded-full sm:py-3"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full bg-white/10 text-white transition disabled:cursor-not-allowed disabled:opacity-30 sm:self-auto"
        aria-label="Submit answer"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
