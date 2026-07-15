import { motion } from "framer-motion";
import { Mic } from "lucide-react";

// Fades in the EchoDraft logo with a microphone icon at the top-left on page load
export default function Logo() {
  return (
    <motion.div
      className="absolute left-8 top-8 flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Mic className="h-5 w-5 text-red-500" />
      <h1 className="text-2xl font-bold text-white">EchoDraft</h1>
    </motion.div>
  );
}
