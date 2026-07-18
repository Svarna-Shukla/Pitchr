import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { SessionRecord } from "../../types/session";

type Props = { sessions: SessionRecord[]; onLoad: (session: SessionRecord) => void; onClose: () => void };

// Overlay listing the last 3 saved sessions, click one to reload it
export default function SessionsPanel({ sessions, onLoad, onClose }: Props) {
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
              <p className="text-xs text-white/50">{s.slides.length} slides</p>
            </button>
          ))}
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
