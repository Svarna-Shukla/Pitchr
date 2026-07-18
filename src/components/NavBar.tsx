import { motion } from "framer-motion";
import { LayoutGrid, Sparkles, Swords } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

export type NavTab = "deck" | "kit" | "battle";

type Props = {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme: Theme;
  onToggleTheme: () => void;
};

const TABS: { id: NavTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "deck", label: "Deck", icon: LayoutGrid },
  { id: "kit", label: "Founder Kit", icon: Sparkles },
  { id: "battle", label: "Battle Card", icon: Swords },
];

// Fixed top nav: logo + tagline, the Deck / Founder Kit / Battle Card tab bar with a sliding indicator, theme toggle
export default function NavBar({ activeTab, onTabChange, theme, onToggleTheme }: Props) {
  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 border-b px-6 py-3"
      style={{
        borderColor: isDark ? "var(--color-border)" : "var(--color-border-light)",
        background: isDark ? "var(--color-bg)" : "var(--color-bg-light)",
      }}
    >
      <div className="flex items-center gap-3">
        <Logo />
        <span
          className="hidden text-xs md:inline"
          style={{ color: isDark ? "var(--color-text-muted)" : "var(--color-text-muted-light)" }}
        >
          Forge your pitch.
        </span>
      </div>

      <div className="relative flex items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition"
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
    </div>
  );
}
