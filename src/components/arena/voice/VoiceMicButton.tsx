import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

type Props = { recording: boolean; onClick: () => void };

const NEON_BLUE = "#38bdf8";

// The default primary response mechanism: a big, pulsing, neon-blue glowing mic button with an
// expanding ring while actively recording. Tapping it while recording manually stops and submits.
export default function VoiceMicButton({ recording, onClick }: Props) {
  return (
    <div className="relative flex items-center justify-center">
      {recording && (
        <motion.span
          className="absolute rounded-full"
          style={{ width: 96, height: 96, border: `2px solid ${NEON_BLUE}` }}
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.button
        onClick={onClick}
        aria-label={recording ? "Stop and submit voice answer" : "Start voice answer"}
        className="relative flex h-20 w-20 items-center justify-center rounded-full outline-none"
        style={{
          background: recording ? "radial-gradient(circle,#0ea5e9,#0369a1)" : "radial-gradient(circle,#1e293b,#0f172a)",
          boxShadow: recording
            ? `0 0 0 2px ${NEON_BLUE}, 0 0 30px 8px rgba(56,189,248,0.55)`
            : `0 0 0 1px rgba(56,189,248,0.35), 0 0 16px 2px rgba(56,189,248,0.25)`,
        }}
        animate={{ scale: recording ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 1.2, repeat: recording ? Infinity : 0, ease: "easeInOut" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {recording ? <Square className="h-6 w-6 fill-white text-white" /> : <Mic className="h-7 w-7 text-[#7dd3fc]" />}
      </motion.button>
    </div>
  );
}
