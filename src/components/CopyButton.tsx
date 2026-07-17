import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Props = { getText: () => string };

// Copies lazily-formatted text to the clipboard and briefly shows a checkmark
export default function CopyButton({ getText }: Props) {
  const [copied, setCopied] = useState(false);

  // Writes the text to the clipboard and flashes the copied state for 1.5s
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently no-op
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Copy"
      className="rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
