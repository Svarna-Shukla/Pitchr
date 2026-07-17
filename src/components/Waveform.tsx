import { motion } from "framer-motion";

type Props = { levels: number[]; active: boolean };

// Renders animated bars that react to live mic input while recording, or idle-pulse otherwise
export default function Waveform({ levels, active }: Props) {
  return (
    <div className="mt-4 flex h-10 items-center gap-1">
      {levels.map((level, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-blue-400"
          animate={{ height: active ? `${8 + level * 32}px` : "4px" }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
}
