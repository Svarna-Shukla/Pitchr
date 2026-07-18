import { useEffect, useRef, useState } from "react";
import NavBar, { type NavTab } from "./components/NavBar";
import BottomBar from "./components/BottomBar";
import DeckPage from "./components/deck/DeckPage";
import FounderKitPage from "./components/founderkit/FounderKitPage";
import BattleCardTab from "./components/battlecard/BattleCardTab";
import ErrorBoundary from "./components/ErrorBoundary";
import PitcheratorOverlay from "./components/pitcherator/PitcheratorOverlay";
import PresentationMode from "./components/presentation/PresentationMode";
import SessionsPanel from "./components/sessions/SessionsPanel";
import { useSpeech } from "./hooks/useSpeech";
import { useClaude } from "./hooks/useClaude";
import { useAudioLevel } from "./hooks/useAudioLevel";
import { useFounderKit } from "./hooks/useFounderKit";
import { useCompetitorRadar } from "./hooks/useCompetitorRadar";
import { usePitcherator } from "./hooks/usePitcherator";
import { useSessions } from "./hooks/useSessions";
import { useTheme } from "./hooks/useTheme";
import { exportSlidesToPdf } from "./lib/exportPdf";
import type { SessionRecord } from "./types/session";

const ERROR_FALLBACK = <p className="p-10 text-sm text-red-400">Something went wrong — try Clear and start again.</p>;

// Main app — wires speech recognition, one-shot Groq deck generation, and every feature tab together
export default function App() {
  const speech = useSpeech();
  const claude = useClaude();
  const audio = useAudioLevel();
  const founderKit = useFounderKit();
  const competitorRadar = useCompetitorRadar();
  const pitcherator = usePitcherator();
  const sessions = useSessions();
  const themeState = useTheme();

  const [activeTab, setActiveTab] = useState<NavTab>("deck");
  const [finished, setFinished] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const savedRef = useRef(false);

  // Saves the finished deck to session history exactly once per recording
  useEffect(() => {
    if (finished && !claude.isGenerating && claude.slides.length > 0 && !savedRef.current) {
      sessions.save(claude.slides, founderKit.founderKit);
      savedRef.current = true;
    }
  }, [finished, claude.isGenerating, claude.slides, founderKit.founderKit, sessions.save]);

  // Once the deck finishes generating, automatically scans for competitors from the same source text
  useEffect(() => {
    if (claude.slides.length > 0 && claude.lastInput && !competitorRadar.competitors && !competitorRadar.isGenerating) {
      competitorRadar.generate(claude.lastInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claude.slides, claude.lastInput]);

  // Starts or stops the main pitch recording, generating the full deck once recording stops
  const toggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      audio.stop();
      claude.generate(speech.transcript);
      setFinished(true);
    } else {
      claude.reset();
      founderKit.reset();
      competitorRadar.reset();
      savedRef.current = false;
      setFinished(false);
      speech.start();
      audio.start();
    }
  };

  // Generates a deck directly from typed text, bypassing voice entirely
  const handleInstantGenerate = (text: string) => {
    claude.reset();
    founderKit.reset();
    competitorRadar.reset();
    savedRef.current = false;
    claude.generate(text);
    setFinished(true);
  };

  // Switches tabs, lazily generating the Founder Kit the first time it's opened
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "kit" && claude.lastInput && !founderKit.founderKit && !founderKit.isGenerating) {
      founderKit.generate(claude.lastInput);
    }
  };

  // Launches Pitcherator using the finished pitch transcript
  const handlePitcherator = () => {
    if (pitcherator.stage === "idle") pitcherator.start(speech.transcript);
  };

  // Rebuilds the deck using the Pitcherator investor Q&A and suggestions, then returns to the Deck tab
  const handleGenerateImprovedDeck = () => {
    if (!pitcherator.scorecard) return;
    const qa = pitcherator.questions.map((q, i) => ({ question: q, answer: pitcherator.answers[i] ?? "" }));
    claude.regenerateWithFeedback(claude.lastInput || speech.transcript, qa, pitcherator.scorecard.suggestions);
    pitcherator.reset();
    setActiveTab("deck");
  };

  // Downloads the current deck as a PDF
  const handleExport = () => {
    setExporting(true);
    try {
      exportSlidesToPdf(claude.slides, themeState.theme);
    } finally {
      setExporting(false);
    }
  };

  // Reloads a previously saved session's slides into the live deck
  const handleLoadSession = (session: SessionRecord) => {
    claude.loadSlides(session.slides);
    setFinished(true);
    setShowSessions(false);
    setActiveTab("deck");
  };

  // Resets every panel and the recording state so the user can start a fresh pitch
  const handleClear = () => {
    if (speech.isListening) {
      speech.stop();
      audio.stop();
    }
    claude.reset();
    founderKit.reset();
    competitorRadar.reset();
    pitcherator.reset();
    savedRef.current = false;
    setFinished(false);
  };

  const isDark = themeState.theme === "dark";

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-y-auto transition-colors duration-500 md:h-screen md:overflow-hidden"
      style={{ background: isDark ? "var(--color-bg)" : "var(--color-bg-light)" }}
    >
      <div className="grain-layer" />
      {isDark && <div className="vignette-layer" />}
      <NavBar activeTab={activeTab} onTabChange={handleTabChange} theme={themeState.theme} onToggleTheme={themeState.toggle} />

      <div className="relative z-10 flex-1 pt-20">
        {activeTab === "deck" && (
          <DeckPage
            isListening={speech.isListening}
            onToggleRecord={toggleRecord}
            transcript={speech.transcript}
            audioLevels={audio.levels}
            isGenerating={claude.isGenerating}
            deckFailed={claude.failed}
            canPitcherate={finished && !speech.isListening && pitcherator.stage === "idle"}
            onPitcherator={handlePitcherator}
            onInstantGenerate={handleInstantGenerate}
            slides={claude.slides}
            theme={themeState.theme}
            competitors={competitorRadar.competitors}
            isCompetitorsGenerating={competitorRadar.isGenerating}
            competitorsFailed={competitorRadar.failed}
          />
        )}
        {activeTab === "kit" && (
          <ErrorBoundary fallback={ERROR_FALLBACK}>
            <FounderKitPage
              founderKit={founderKit.founderKit}
              isGenerating={founderKit.isGenerating}
              failed={founderKit.failed}
              theme={themeState.theme}
            />
          </ErrorBoundary>
        )}
        {activeTab === "battle" && (
          <ErrorBoundary fallback={ERROR_FALLBACK}>
            <BattleCardTab theme={themeState.theme} />
          </ErrorBoundary>
        )}
      </div>

      <BottomBar
        hasSlides={claude.slides.length > 0}
        pitcheratorActive={pitcherator.stage !== "idle"}
        exporting={exporting}
        theme={themeState.theme}
        onPitcherator={handlePitcherator}
        onPresent={() => setShowPresentation(true)}
        onExport={handleExport}
        onSessions={() => setShowSessions(true)}
        onClear={handleClear}
      />

      {pitcherator.stage !== "idle" && (
        <PitcheratorOverlay pitcherator={pitcherator} onClose={pitcherator.reset} onGenerateImprovedDeck={handleGenerateImprovedDeck} />
      )}
      {showPresentation && (
        <PresentationMode slides={claude.slides} theme={themeState.theme} onClose={() => setShowPresentation(false)} />
      )}
      {showSessions && (
        <SessionsPanel sessions={sessions.sessions} onLoad={handleLoadSession} onClose={() => setShowSessions(false)} />
      )}
    </div>
  );
}
