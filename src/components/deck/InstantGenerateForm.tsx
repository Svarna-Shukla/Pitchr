import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Theme } from "../../hooks/useTheme";
import Button from "../Button";

type Props = { onGenerate: (text: string) => void; disabled: boolean; theme: Theme };

// Textarea + button that feeds typed text into the same deck generation pipeline as voice
export default function InstantGenerateForm({ onGenerate, disabled, theme }: Props) {
  const [text, setText] = useState("");
  const isDark = theme === "dark";

  // Submits the typed idea for deck generation and clears the field
  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onGenerate(text.trim());
    setText("");
  };

  return (
    <div className="mt-8 flex w-full max-w-xl flex-col items-center gap-3 px-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or type your idea here..."
        rows={3}
        className={`w-full resize-none rounded-xl border p-4 text-sm outline-none transition ${
          isDark
            ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-[color:var(--color-accent)]/50"
            : "border-black/10 bg-black/[0.02] text-black placeholder:text-black/30 focus:border-[color:var(--color-accent)]/50"
        }`}
      />
      <Button onClick={handleSubmit} disabled={disabled || !text.trim()}>
        <Sparkles className="h-4 w-4" /> Generate Deck
      </Button>
    </div>
  );
}
