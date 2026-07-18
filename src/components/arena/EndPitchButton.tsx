type Props = { onClick: () => void };

// Small, subtle, grey button pinned bottom-right for founders who want to bail voluntarily and see
// their scorecard instead of getting ground down to 0 health
export default function EndPitchButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-[65] min-h-[44px] rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white/40 backdrop-blur-md transition hover:border-white/25 hover:text-white/70 md:bottom-4"
    >
      End Pitch
    </button>
  );
}
