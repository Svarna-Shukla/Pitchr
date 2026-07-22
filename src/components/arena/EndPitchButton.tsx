import { useState } from "react";

type Props = { onClick: () => void };

// Small button pinned bottom-right for founders who want to bail voluntarily and see their scorecard
// instead of getting ground down to 0 health. Confirms first so it can't be triggered by accident.
export default function EndPitchButton({ onClick }: Props) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="fixed bottom-24 right-4 z-[66] flex w-64 flex-col gap-3 rounded-xl border border-white/20 bg-black/90 p-4 text-left backdrop-blur-md md:bottom-4">
        <p className="text-sm text-white/80">Ready to wrap up? You'll go straight to your scorecard.</p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-white/60 transition hover:text-white"
          >
            Cancel
          </button>
          <button onClick={onClick} className="flex-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90">
            End
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="fixed bottom-24 right-4 z-[65] min-h-[44px] rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-medium text-white/40 backdrop-blur-md transition hover:border-white/50 hover:text-white/70 md:bottom-4"
    >
      End Pitch
    </button>
  );
}
