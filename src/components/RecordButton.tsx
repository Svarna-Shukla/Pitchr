import { motion } from "framer-motion";
import { Square } from "lucide-react";

type Props = { recording: boolean; onClick: () => void };

// Slow heartbeat glow when idle; switches to a glowing stop button while recording
export default function RecordButton({ recording, onClick }: Props) {
  return (
    <motion.button
      className="relative flex h-20 w-20 items-center justify-center rounded-full outline-none"
      style={{
        background: recording ? "#dc2626" : "#ef4444",
        boxShadow: recording
          ? "0 0 50px 15px rgba(239,68,68,0.7)"
          : "0 0 25px 8px rgba(239,68,68,0.35)",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: recording ? 1.1 : [1, 1.05, 1, 1.03, 1],
        boxShadow: recording
          ? "0 0 50px 15px rgba(239,68,68,0.7)"
          : [
              "0 0 25px 8px rgba(239,68,68,0.35)",
              "0 0 40px 14px rgba(239,68,68,0.55)",
              "0 0 25px 8px rgba(239,68,68,0.35)",
              "0 0 35px 12px rgba(239,68,68,0.45)",
              "0 0 25px 8px rgba(239,68,68,0.35)",
            ],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 3.0 },
        scale: recording ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 3.0 },
        boxShadow: recording ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 3.0 },
      }}
      whileHover={{ scale: recording ? 1.12 : 1.08 }}
      whileTap={{ scale: 1.15 }}
      onClick={onClick}
      aria-label={recording ? "Stop recording" : "Start recording"}
    >
      {recording && <Square className="h-6 w-6 fill-white text-white" />}
    </motion.button>
  );
}
