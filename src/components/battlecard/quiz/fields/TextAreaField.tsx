type Props = { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number };

// A multi-line labeled textarea, styled for the Battle Card tab's always-dark surface
export default function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[color:var(--color-accent)] placeholder:text-white/25"
      />
    </div>
  );
}
