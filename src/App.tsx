import { useEffect, useRef, useState } from "react";
import BackgroundOrbs from "./components/BackgroundOrbs";
import Particles from "./components/Particles";
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";
import LeftColumn from "./components/layout/LeftColumn";
import SidePanel from "./components/panel/SidePanel";
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

// Main app — wires speech recognition, Groq generation, and every feature panel together
export default function App() {
  const speech = useSpeech();
  const claude = useClaude();
  const audio = useAudioLevel();
  const founderKit = useFounderKit();
  const competitorRadar = useCompetitorRadar();
  const pitcherator = usePitcherator();
  const sessions = useSessions();
  const themeState = useTheme();

  const [finished, setFinished] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (speech.isListening) claude.feedTranscript(speech.transcript);
  }, [speech.transcript, speech.isListening, claude.feedTranscript]);

  // Saves the finished deck to session history exactly once per recording
  useEffect(() => {
    if (finished && !claude.isGenerating && claude.slides.length > 0 && !savedRef.current) {
      sessions.save(claude.slides, founderKit.founderKit);
      savedRef.current = true;
    }
  }, [finished, claude.isGenerating, claude.slides, founderKit.founderKit, sessions.save]);

  // Starts or stops the main pitch recording
  const toggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      audio.stop();
      claude.flush(speech.transcript);
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

  // Lazily generates the Founder Kit the first time that tab is opened
  const handleOpenFounderKit = () => {
    if (!founderKit.founderKit && !founderKit.isGenerating) founderKit.generate(speech.transcript);
  };

  // Lazily generates the Competitor Radar the first time that tab is opened
  const handleOpenCompetitorRadar = () => {
    if (!competitorRadar.competitors && !competitorRadar.isGenerating) competitorRadar.generate(speech.transcript);
  };

  // Launches Pitcherator using the finished pitch transcript
  const handlePitcherator = () => {
    if (pitcherator.stage === "idle") pitcherator.start(speech.transcript);
  };

  // Downloads the current deck as a PDF
  const handleExport = () => {
    setExporting(true);
    try {
      exportSlidesToPdf(claude.slides);
    } finally {
      setExporting(false);
    }
  };

  // Reloads a previously saved session's slides into the live deck
  const handleLoadSession = (session: SessionRecord) => {
    claude.loadSlides(session.slides);
    setFinished(true);
    setShowSessions(false);
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

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto md:h-screen md:flex-row md:overflow-hidden">
      <BackgroundOrbs recording={speech.isListening} />
      <Particles />
      <NavBar />
      <div className="relative z-10 flex w-full flex-1 flex-col md:flex-row">
        <LeftColumn
          isListening={speech.isListening}
          onToggleRecord={toggleRecord}
          transcript={speech.transcript}
          audioLevels={audio.levels}
          finished={finished}
          isGenerating={claude.isGenerating}
          canPitcherate={finished && !speech.isListening && pitcherator.stage === "idle"}
          onPitcherator={handlePitcherator}
        />
        {claude.slides.length > 0 && (
          <ErrorBoundary fallback={<p className="p-6 text-sm text-red-400">Something went wrong rendering this panel — try Clear and start again.</p>}>
            <SidePanel
              slides={claude.slides}
              theme={themeState.theme}
              onToggleTheme={themeState.toggle}
              onClear={handleClear}
              founderKit={founderKit.founderKit}
              isFounderKitGenerating={founderKit.isGenerating}
              founderKitFailed={founderKit.failed}
              onOpenFounderKit={handleOpenFounderKit}
              competitors={competitorRadar.competitors}
              isCompetitorsGenerating={competitorRadar.isGenerating}
              competitorsFailed={competitorRadar.failed}
              onOpenCompetitorRadar={handleOpenCompetitorRadar}
            />
          </ErrorBoundary>
        )}
      </div>

      <BottomBar
        hasSlides={claude.slides.length > 0}
        pitcheratorActive={pitcherator.stage !== "idle"}
        exporting={exporting}
        onPitcherator={handlePitcherator}
        onPresent={() => setShowPresentation(true)}
        onExport={handleExport}
        onSessions={() => setShowSessions(true)}
      />

      {pitcherator.stage !== "idle" && (
        <PitcheratorOverlay pitcherator={pitcherator} speech={speech} onClose={pitcherator.reset} />
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
