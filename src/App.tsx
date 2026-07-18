import { useEffect, useRef, useState } from "react";
import NavBar, { type NavTab } from "./components/NavBar";
import BottomBar from "./components/BottomBar";
import BackgroundGrid from "./components/BackgroundGrid";
import DeckPage from "./components/deck/DeckPage";
import FounderKitPage from "./components/founderkit/FounderKitPage";
import BattleCardTab from "./components/battlecard/BattleCardTab";
import ErrorBoundary from "./components/ErrorBoundary";
import Hero from "./components/hero/Hero";
import BattleArena from "./components/arena/BattleArena";
import DeckForgingOverlay from "./components/arena/DeckForgingOverlay";
import PresentationMode from "./components/presentation/PresentationMode";
import SessionsPanel from "./components/sessions/SessionsPanel";
import { useSpeech } from "./hooks/useSpeech";
import { useClaude } from "./hooks/useClaude";
import { useAudioLevel } from "./hooks/useAudioLevel";
import { useFounderKit } from "./hooks/useFounderKit";
import { useCompetitorRadar } from "./hooks/useCompetitorRadar";
import { useBattleArena } from "./hooks/useBattleArena";
import { useSessions } from "./hooks/useSessions";
import { useTheme } from "./hooks/useTheme";
import { exportSlidesToPdf } from "./lib/exportPdf";
import type { SessionRecord } from "./types/session";

const ERROR_FALLBACK = <p className="p-10 text-sm text-red-400">Something went wrong — try Clear and start again.</p>;

// Main app — wires speech recognition, the Battle Arena, one-shot Groq deck generation, and every feature tab together
export default function App() {
  const speech = useSpeech();
  const claude = useClaude();
  const audio = useAudioLevel();
  const founderKit = useFounderKit();
  const competitorRadar = useCompetitorRadar();
  const arena = useBattleArena();
  const sessions = useSessions();
  const themeState = useTheme();

  const [activeTab, setActiveTab] = useState<NavTab>("arena");
  const [arenaEntered, setArenaEntered] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const savedRef = useRef(false);
  const generatingDeckFromArena = useRef(false);
  const deckLocked = arena.phase !== "scorecard" || arena.isPartial;

  // Saves the finished deck to session history exactly once per Battle Arena run
  useEffect(() => {
    if (!claude.isGenerating && claude.slides.length > 0 && !savedRef.current) {
      sessions.save(claude.slides, founderKit.founderKit);
      savedRef.current = true;
    }
  }, [claude.isGenerating, claude.slides, founderKit.founderKit, sessions.save]);

  // Once the deck finishes generating, automatically scans for competitors from the same source text
  useEffect(() => {
    if (claude.slides.length > 0 && claude.lastInput && !competitorRadar.competitors && !competitorRadar.isGenerating) {
      competitorRadar.generate(claude.lastInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claude.slides, claude.lastInput]);

  // Once a deck triggered from the arena's scorecard finishes generating, switch over to the newly unlocked Deck tab
  useEffect(() => {
    if (generatingDeckFromArena.current && !claude.isGenerating && claude.slides.length > 0) {
      generatingDeckFromArena.current = false;
      setActiveTab("deck");
    }
  }, [claude.isGenerating, claude.slides]);

  // Starts or stops the founder's live pitch capture used by the arena's intake step
  const toggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      audio.stop();
    } else {
      claude.reset();
      founderKit.reset();
      competitorRadar.reset();
      savedRef.current = false;
      speech.start();
      audio.start();
    }
  };

  // Switches tabs, lazily generating the Founder Kit the first time it's opened
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "kit" && claude.lastInput && !founderKit.founderKit && !founderKit.isGenerating) {
      founderKit.generate(claude.lastInput);
    }
  };

  // Builds the deck from the full 3-round battle transcript once the scorecard names a winner
  const handleGenerateDeck = () => {
    if (!arena.scorecard) return;
    generatingDeckFromArena.current = true;
    claude.regenerateWithFeedback(arena.pitchTranscript, arena.rounds, arena.scorecard.suggestions);
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
    arena.fightAgain();
    savedRef.current = false;
  };

  const isDark = themeState.theme === "dark";

  return (
    <div
      className="relative flex min-h-screen w-full flex-col transition-colors duration-500"
      style={{ background: isDark ? "var(--color-bg)" : "var(--color-bg-light)" }}
    >
      <BackgroundGrid theme={themeState.theme} />
      <div className="grain-layer" />
      {isDark && <div className="vignette-layer" />}
      <NavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={themeState.theme}
        onToggleTheme={themeState.toggle}
        deckLocked={deckLocked}
      />

      <div className="relative z-10 flex-1 pt-20">
        {activeTab === "arena" && !arenaEntered && (
          <Hero onStartPitching={() => setArenaEntered(true)} onTypeInstead={() => setArenaEntered(true)} />
        )}
        {activeTab === "arena" && arenaEntered && (
          <ErrorBoundary fallback={ERROR_FALLBACK}>
            <BattleArena
              arena={arena}
              isListening={speech.isListening}
              transcript={speech.transcript}
              audioLevels={audio.levels}
              onToggleRecord={toggleRecord}
              onGenerateDeck={handleGenerateDeck}
              isGeneratingDeck={claude.isGenerating}
            />
          </ErrorBoundary>
        )}
        {activeTab === "deck" && (
          <DeckPage
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

      {activeTab !== "arena" && (
        <BottomBar
          hasSlides={claude.slides.length > 0}
          exporting={exporting}
          theme={themeState.theme}
          onPresent={() => setShowPresentation(true)}
          onExport={handleExport}
          onSessions={() => setShowSessions(true)}
          onClear={handleClear}
        />
      )}

      {generatingDeckFromArena.current && claude.isGenerating && <DeckForgingOverlay />}

      {showPresentation && (
        <PresentationMode slides={claude.slides} theme={themeState.theme} onClose={() => setShowPresentation(false)} />
      )}
      {showSessions && (
        <SessionsPanel sessions={sessions.sessions} onLoad={handleLoadSession} onClose={() => setShowSessions(false)} />
      )}
    </div>
  );
}
