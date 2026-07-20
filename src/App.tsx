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
import { buildArenaTranscript } from "./lib/text";
import { combinedGrade, overallScore } from "./lib/scoring";
import type { SessionRecord } from "./types/session";
import type { SlideTheme } from "./lib/premiumSlideTheme";

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
  // Slides' own remixable theme (Pitchr Neon / YC Minimal / Cyberpunk) — independent of the app's
  // own theme toggle (themeState above)
  const [slideTheme, setSlideTheme] = useState<SlideTheme>("neon");
  const [showSessions, setShowSessions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [kitInput, setKitInput] = useState("");
  const [deckInput, setDeckInput] = useState("");
  const savedRef = useRef(false);
  const generatingDeckFromArena = useRef(false);
  const kitSeededRef = useRef(false);
  const deckSeededRef = useRef(false);

  // Saves the finished deck to session history exactly once per generation. When the deck came from
  // a completed (non-partial) Battle Arena run, also records the health/grade/questions-survived that
  // produced it, so the Sessions panel can show them alongside the deck.
  useEffect(() => {
    if (!claude.isGenerating && claude.slides.length > 0 && !savedRef.current) {
      const fromArena = generatingDeckFromArena.current && arena.scorecard && !arena.isPartial;
      const arenaStats = fromArena
        ? {
            healthRemaining: arena.health,
            grade: combinedGrade(overallScore(arena.scorecard!.ratings), arena.health),
            questionsSurvived: arena.rounds.length,
          }
        : undefined;
      sessions.save(claude.slides, founderKit.founderKit, arenaStats);
      savedRef.current = true;
    }
  }, [claude.isGenerating, claude.slides, founderKit.founderKit, sessions.save, arena.scorecard, arena.isPartial, arena.health, arena.rounds.length]);

  // Seeds the Founder Kit input once from the deck transcript, or from a just-completed Battle
  // Arena session's full pitch + Q&A — never overwrites text the founder already typed or pasted
  useEffect(() => {
    if (kitSeededRef.current || kitInput) return;
    if (claude.lastInput) {
      setKitInput(claude.lastInput);
      kitSeededRef.current = true;
    } else if (arena.phase === "scorecard" && arena.pitchTranscript) {
      setKitInput(buildArenaTranscript(arena.pitchTranscript, arena.rounds));
      kitSeededRef.current = true;
    }
  }, [claude.lastInput, arena.phase, arena.pitchTranscript, arena.rounds, kitInput]);

  // Seeds the standalone Deck tab's textarea from any Arena transcript already in progress or
  // completed — never overwrites text the founder already typed or pasted directly into the Deck tab
  useEffect(() => {
    if (deckSeededRef.current || deckInput) return;
    if (arena.pitchTranscript) {
      setDeckInput(buildArenaTranscript(arena.pitchTranscript, arena.rounds));
      deckSeededRef.current = true;
    }
  }, [arena.pitchTranscript, arena.rounds, deckInput]);

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
      setKitInput("");
      kitSeededRef.current = false;
      speech.start();
      audio.start();
    }
  };

  // Switches the active tab
  const handleTabChange = (tab: NavTab) => setActiveTab(tab);

  // Builds the deck from the full 3-round battle transcript once the scorecard names a winner
  const handleGenerateDeck = () => {
    if (!arena.scorecard) return;
    generatingDeckFromArena.current = true;
    claude.regenerateWithFeedback(arena.pitchTranscript, arena.rounds, arena.scorecard.suggestions);
  };

  // Builds the deck straight from whatever's in the Deck tab's own textarea — no Arena session
  // required, this is the standalone entry point into deck generation
  const handleGenerateDeckStandalone = () => {
    if (!deckInput.trim()) return;
    generatingDeckFromArena.current = false;
    claude.generate(deckInput);
  };

  // Downloads the current deck as a PDF, rasterizing each slide off-screen — can take a few seconds.
  // Each slide capture is individually timeout-guarded (see exportSlidesToPdf), so a stuck capture
  // surfaces as a caught error here instead of leaving the Export button spinning forever.
  const handleExport = async () => {
    setExporting(true);
    try {
      await exportSlidesToPdf(claude.slides, slideTheme);
    } catch (err) {
      console.error("Deck PDF export failed:", err);
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
    setKitInput("");
    kitSeededRef.current = false;
    setDeckInput("");
    deckSeededRef.current = false;
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
              speechSupported={speech.supported}
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
            slideTheme={slideTheme}
            onSelectSlideTheme={setSlideTheme}
            competitors={competitorRadar.competitors}
            isCompetitorsGenerating={competitorRadar.isGenerating}
            competitorsFailed={competitorRadar.failed}
            input={deckInput}
            onInputChange={setDeckInput}
            onGenerate={handleGenerateDeckStandalone}
            isGenerating={claude.isGenerating}
            failed={claude.failed}
          />
        )}
        {activeTab === "kit" && (
          <ErrorBoundary fallback={ERROR_FALLBACK}>
            <FounderKitPage
              founderKit={founderKit.founderKit}
              isGenerating={founderKit.isGenerating}
              failed={founderKit.failed}
              theme={themeState.theme}
              input={kitInput}
              onInputChange={setKitInput}
              onGenerate={() => founderKit.generate(kitInput)}
            />
          </ErrorBoundary>
        )}
        {activeTab === "battle" && (
          <ErrorBoundary fallback={ERROR_FALLBACK}>
            <BattleCardTab />
          </ErrorBoundary>
        )}
      </div>

      {activeTab !== "arena" && (
        <BottomBar
          hasSlides={claude.slides.length > 0}
          exporting={exporting}
          theme={themeState.theme}
          onPresent={() => {
            // Requesting fullscreen must happen synchronously inside the click handler — deferring
            // it into PresentationMode's mount effect loses the click's transient user activation
            // in some browsers and the request silently fails
            document.documentElement.requestFullscreen?.().catch(() => {});
            setShowPresentation(true);
          }}
          onExport={handleExport}
          onSessions={() => setShowSessions(true)}
          onClear={handleClear}
        />
      )}

      {generatingDeckFromArena.current && claude.isGenerating && <DeckForgingOverlay />}

      {showPresentation && (
        <PresentationMode
          slides={claude.slides}
          slideTheme={slideTheme}
          onSelectSlideTheme={setSlideTheme}
          onClose={() => setShowPresentation(false)}
        />
      )}
      {showSessions && (
        <SessionsPanel
          sessions={sessions.sessions}
          onLoad={handleLoadSession}
          onClearAll={sessions.clearAll}
          onClose={() => setShowSessions(false)}
        />
      )}
    </div>
  );
}
