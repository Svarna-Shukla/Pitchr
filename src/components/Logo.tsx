import { motion } from "framer-motion";
import { Mic } from "lucide-react";

// Fades in the EchoDraft logo with a microphone icon on page load
export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Mic className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      <h1 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
        EchoDraft
      </h1>
    </motion.div>
  );
}
