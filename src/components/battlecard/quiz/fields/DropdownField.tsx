type Props = { label: string; value: string; options: string[]; onChange: (v: string) => void };

// A labeled native <select>, styled for the Battle Card tab's always-dark surface
export default function DropdownField({ label, value, options, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[color:var(--color-accent)]"
      >
        <option value="" disabled className="bg-[#111118]">
          Choose one…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#111118]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
