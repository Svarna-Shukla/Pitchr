type Props = { supported: boolean };

const IS_IOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

// Subtle warning shown when the browser has no SpeechRecognition support (most mobile browsers other
// than Chrome on Android), nudging the founder toward the always-visible text input instead
export default function VoiceSupportBanner({ supported }: Props) {
  if (supported) return null;
  return (
    <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-xs text-white/50">
      Voice input is not supported on this browser. Please type your answer below.
      {IS_IOS && <span className="mt-1 block text-white/40">For voice input on iPhone, open this page in Chrome.</span>}
    </div>
  );
}
