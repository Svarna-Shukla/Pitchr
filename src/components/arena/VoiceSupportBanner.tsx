import { useState } from "react";
import { X } from "lucide-react";

type Props = { supported: boolean };

const IS_IOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

// Dismissible warning shown when the browser has no SpeechRecognition support (most mobile browsers
// other than Chrome on Android), nudging the founder toward the always-visible text input instead
export default function VoiceSupportBanner({ supported }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (supported || dismissed) return null;
  return (
    <div className="flex w-full max-w-md items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-xs text-white/50">
      <p className="flex-1">
        Voice input is not supported on this browser. Please type your answer. Use Chrome on Android for voice support.
        {IS_IOS && <span className="mt-1 block text-white/40">Open in Chrome for voice input.</span>}
      </p>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="shrink-0 text-white/40 hover:text-white/70">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
