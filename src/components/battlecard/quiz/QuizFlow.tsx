import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { useBattleCardQuiz } from "../../../hooks/useBattleCardQuiz";
import { TOTAL_SECTIONS } from "../../../hooks/useBattleCardQuiz";
import QuizProgressBar from "./QuizProgressBar";
import QuizNav from "./QuizNav";
import IdentitySection from "./sections/IdentitySection";
import InnovationSection from "./sections/InnovationSection";
import MarketSection from "./sections/MarketSection";
import ExecutionSection from "./sections/ExecutionSection";
import DefensibilitySection from "./sections/DefensibilitySection";
import FlavorSection from "./sections/FlavorSection";

type Props = { quiz: ReturnType<typeof useBattleCardQuiz>; isGenerating: boolean; failed: boolean; onGenerate: () => void };

const TITLES = ["Identity", "Innovation", "Market", "Execution", "Defensibility", "Card Flavour"];

// Full multi-step quiz: progress bar up top, one section visible at a time with a sliding transition, nav footer
export default function QuizFlow({ quiz, isGenerating, failed, onGenerate }: Props) {
  const { section, answers, setField, toggleMoat, next, back } = quiz;
  const [direction, setDirection] = useState(1);

  // Advances a section forward, remembering direction so the slide animates the right way
  const handleNext = () => {
    setDirection(1);
    next();
  };
  // Steps a section back, remembering direction so the slide animates the right way
  const handleBack = () => {
    setDirection(-1);
    back();
  };

  const sections = [
    <IdentitySection answers={answers} setField={setField} />,
    <InnovationSection answers={answers} setField={setField} />,
    <MarketSection answers={answers} setField={setField} />,
    <ExecutionSection answers={answers} setField={setField} />,
    <DefensibilitySection answers={answers} setField={setField} toggleMoat={toggleMoat} />,
    <FlavorSection answers={answers} setField={setField} />,
  ];

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <QuizProgressBar section={section} total={TOTAL_SECTIONS} title={TITLES[section]} />
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={section}
            custom={direction}
            initial={{ x: direction * 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {sections[section]}
          </motion.div>
        </AnimatePresence>
      </div>
      {failed && <p className="mt-4 text-sm text-red-400">Couldn't forge your card — check your answers and try again.</p>}
      <QuizNav
        section={section}
        isLast={section === TOTAL_SECTIONS - 1}
        isGenerating={isGenerating}
        onBack={handleBack}
        onNext={handleNext}
        onGenerate={onGenerate}
      />
    </div>
  );
}
