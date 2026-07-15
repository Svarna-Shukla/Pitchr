import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackgroundOrbs from "./components/BackgroundOrbs";
import Particles from "./components/Particles";
import Logo from "./components/Logo";
import Headline from "./components/Headline";
import Subtitle from "./components/Subtitle";
import RecordButton from "./components/RecordButton";
import Transcript from "./components/Transcript";
import SlideCard from "./components/SlideCard";
import { useSpeech } from "./hooks/useSpeech";
import { useClaude } from "./hooks/useClaude";

// Main app — wires speech recognition, Claude slide generation, and the landing UI together
export default function App() {
  const { transcript, isListening, start, stop } = useSpeech();
  const { slides, isGenerating, feedTranscript, flush, reset } = useClaude();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (isListening) feedTranscript(transcript);
  }, [transcript, isListening, feedTranscript]);

  // Toggles recording on/off and triggers slide generation when stopping
  const toggle = () => {
    if (isListening) { stop(); flush(transcript); setFinished(true); }
    else { reset(); setFinished(false); start(); }
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <BackgroundOrbs recording={isListening} />
      <Particles />
      <Logo />
      <div className="relative z-10 flex w-full">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
          <Headline />
          <Subtitle />
          <div className="mt-12 flex flex-col items-center">
            <RecordButton recording={isListening} onClick={toggle} />
            <p className="mt-3 text-xs text-gray-500">
              {isListening ? "Listening… click to stop" : "Click to start speaking"}
            </p>
            <Transcript text={transcript} isListening={isListening} />
            {finished && !isListening && (
              <motion.p className="mt-6 text-lg font-semibold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                Your pitch deck is ready{isGenerating ? "…" : ""}
              </motion.p>
            )}
          </div>
        </div>
        {slides.length > 0 && (
          <div className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/5 p-6">
            {slides.map((s, i) => <SlideCard key={`${s.title}-${i}`} slide={s} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
