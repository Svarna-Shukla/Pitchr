import CopyButton from "../CopyButton";

type Props = { label: string; content: string | string[] };

// Renders one Founder Kit document as a labelled card with a copy button
export default function FounderKitCard({ label, content }: Props) {
  const text = Array.isArray(content) ? content.join("\n") : content;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400">{label}</h4>
        <CopyButton getText={() => text} />
      </div>
      {Array.isArray(content) ? (
        <ul className="mt-3 space-y-2">
          {content.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/80">
              <span className="text-blue-400">-</span>
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/80">{content}</p>
      )}
    </div>
  );
}
