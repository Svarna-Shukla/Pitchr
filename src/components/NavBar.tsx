import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, LayoutGrid, Sparkles, Swords } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

export type NavTab = "arena" | "deck" | "kit" | "battle";

type Props = {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme: Theme;
  onToggleTheme: () => void;
  deckLocked: boolean;
};

const TABS: { id: NavTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "arena", label: "Arena", icon: Flame },
  { id: "deck", label: "Deck", icon: LayoutGrid },
  { id: "kit", label: "Founder Kit", icon: Sparkles },
  { id: "battle", label: "Battle Card", icon: Swords },
];

// Fixed top nav: logo + tagline, the Arena / Deck / Founder Kit / Battle Card tab bar with a sliding
// indicator, theme toggle. Sits above the Arena's fullscreen overlay (z-50) so tabs stay clickable.
export default function NavBar({ activeTab, onTabChange, theme, onToggleTheme, deckLocked }: Props) {
  const isDark = theme === "dark";

  // Very slight perspective lift as the page scrolls, so the nav feels like it rises off the page
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 160], [0, -2.5]);
  const y = useTransform(scrollY, [0, 160], [0, -2]);
  const shadowOpacity = useTransform(scrollY, [0, 160], [0, 0.35]);
  const boxShadow = useTransform(shadowOpacity, (o) => `0 14px 32px -14px rgba(0,0,0,${o})`);

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-2 border-b px-3 py-2 sm:gap-4 sm:px-6 sm:py-3"
      style={{
        borderColor: isDark ? "var(--color-border)" : "var(--color-border-light)",
        background: isDark ? "var(--color-bg)" : "var(--color-bg-light)",
        transformPerspective: 800,
        rotateX,
        y,
        boxShadow,
      }}
    >
      <div className="flex items-center gap-3">
        <Logo theme={theme} />
        <span
          className="hidden text-xs md:inline"
          style={{ color: isDark ? "var(--color-text-muted)" : "var(--color-text-muted-light)" }}
        >
          Forge your pitch.
        </span>
      </div>

      <div className="relative flex items-center gap-0.5 sm:gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          const locked = tab.id === "deck" && deckLocked;
          return (
            <button
              key={tab.id}
              onClick={() => !locked && onTabChange(tab.id)}
              className={`relative flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition sm:px-3 sm:py-1.5 ${
                locked ? "pointer-events-none opacity-40" : ""
              }`}
              style={{ color: active ? "var(--color-accent)" : isDark ? "var(--color-text-secondary)" : "var(--color-text-secondary-light)" }}
            >
              {active && (
                <motion.span
                  layoutId="nav-tab-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--color-accent-soft)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </motion.div>
  );
}
