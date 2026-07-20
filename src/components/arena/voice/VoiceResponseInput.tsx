import VoiceMicButton from "./VoiceMicButton";
import AudioWaveform from "./AudioWaveform";
import LiveTranscriptStream from "./LiveTranscriptStream";

type Props = { transcript: string; isListening: boolean; onToggleMic: () => void };

// Voice-first primary response surface: the pulsing neon mic, a reactive waveform driven by the
// founder's own mic input, and the live streaming transcript building up beneath it in real time.
// Silence detection and the 60s countdown both auto-submit from the caller — this component is
// purely presentational plus the mic tap-to-stop gesture.
export default function VoiceResponseInput({ transcript, isListening, onToggleMic }: Props) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <VoiceMicButton recording={isListening} onClick={onToggleMic} />
      <AudioWaveform active={isListening} />
      <LiveTranscriptStream text={transcript} isListening={isListening} />
      {!transcript && isListening && <p className="text-xs text-[#7dd3fc]/70">Listening… speak your answer</p>}
    </div>
  );
}
