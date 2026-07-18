import { useCallback, useRef, useState } from "react";

// The number of bars we want to display in our frontend audio waveform UI
const BAR_COUNT = 24;

// Captures live mic input and exposes normalized bar levels for a waveform visualizer
export function useAudioLevel() {
  const [levels, setLevels] = useState<number[]>(Array(BAR_COUNT).fill(0));
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reads the current frequency data and maps it onto BAR_COUNT normalized bars
  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const step = Math.floor(data.length / BAR_COUNT) || 1;
    const next = Array.from({ length: BAR_COUNT }, (_, i) => data[i * step] / 255);
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Requests mic access and starts the analyser + animation loop
  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      streamRef.current = stream;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // Mic permission denied or unavailable — waveform simply stays flat
    }
  }, [tick]);

  // Tears down the analyser, animation loop, and mic stream
  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close();
    rafRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
    setLevels(Array(BAR_COUNT).fill(0));
  }, []);

  return { levels, start, stop };
}

// This hook builds the animated microphone waveform for the "Live Deck Build" feature, turning the founder's 3 AM voice notes into clean UI visualizer bars.
