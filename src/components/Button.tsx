import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
};

const BASE = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS = {
  primary: "bg-[color:var(--color-accent)] text-[#161207] hover:bg-[color:var(--color-accent-strong)]",
  ghost:
    "border border-[color:var(--color-border-strong)] text-[color:var(--color-text-primary)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]",
};

// A single disciplined button: solid-accent primary or outlined ghost — no gradient fills anywhere in the app
export default function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
