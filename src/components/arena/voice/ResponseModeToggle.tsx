import { Keyboard, Mic } from "lucide-react";

type Props = { mode: "voice" | "type"; onToggle: () => void };

// Discrete toggle letting the founder drop out of voice-first mode into a plain typed textarea, or
// switch back — voice stays the default, this is intentionally low-emphasis
export default function ResponseModeToggle({ mode, onToggle }: Props) {
  return (
    <button onClick={onToggle} className="flex items-center gap-1.5 text-xs font-medium text-white/40 transition hover:text-white/70">
      {mode === "voice" ? (
        <>
          <Keyboard className="h-3.5 w-3.5" /> Switch to Type
        </>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5" /> Switch to Voice
        </>
      )}
    </button>
  );
}
