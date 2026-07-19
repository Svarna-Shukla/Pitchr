import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import type { SessionRecord } from "../../types/session";

type Props = { sessions: SessionRecord[]; onLoad: (session: SessionRecord) => void; onClearAll: () => void; onClose: () => void };

// Overlay listing the last 5 saved sessions, click one to reload it
export default function SessionsPanel({ sessions, onLoad, onClearAll, onClose }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white" aria-label="Close">
        <X className="h-6 w-6" />
      </button>
      <div style={{ perspective: "1200px" }}>
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f1a] p-6"
        initial={{ opacity: 0, rotateX: -14, y: 12 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <h3 className="text-lg font-bold text-white">Previous Sessions</h3>
        {sessions.length === 0 && <p className="mt-3 text-sm text-white/50">No saved sessions yet.</p>}
        <div className="mt-4 flex flex-col gap-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onLoad(s)}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
            >
              <p className="text-xs text-white/40">{new Date(s.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-sm font-semibold text-white">{s.slides[0]?.title ?? "Untitled deck"}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                <span>{s.slides.length} slides</span>
                {s.grade && <span>Grade {s.grade}</span>}
                {typeof s.healthRemaining === "number" && <span>{Math.round(s.healthRemaining)} health remaining</span>}
                {typeof s.questionsSurvived === "number" && <span>{s.questionsSurvived} questions survived</span>}
              </div>
            </button>
          ))}
        </div>
        {sessions.length > 0 && (
          <button
            onClick={onClearAll}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-red-400/70 transition hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        )}
      </motion.div>
      </div>
    </motion.div>
  );
}
