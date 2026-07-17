export type PanelTab = "slides" | "kit" | "radar";

type Props = {
  active: PanelTab;
  onChange: (tab: PanelTab) => void;
  slidesReady: boolean;
};

const TABS: { id: PanelTab; label: string }[] = [
  { id: "slides", label: "Slides" },
  { id: "kit", label: "Founder Kit" },
  { id: "radar", label: "Competitor Radar" },
];

// Renders the Slides / Founder Kit / Competitor Radar tab row; the latter two are enabled once a deck exists
// and lazily trigger their own generation the first time they're opened
export default function PanelTabs({ active, onChange, slidesReady }: Props) {
  return (
    <div className="flex gap-1 border-b border-white/10 pb-2">
      {TABS.map((tab) => {
        const enabled = tab.id === "slides" || slidesReady;
        return (
          <button
            key={tab.id}
            disabled={!enabled}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              active === tab.id
                ? "bg-white/10 text-white"
                : enabled
                ? "text-white/50 hover:text-white/80"
                : "cursor-not-allowed text-white/20"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
