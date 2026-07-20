import { useEffect, useRef } from "react";

type Props = { active: boolean };

const BAR_COUNT = 32;
const NEON_BLUE = "#38bdf8";

// Native Web Audio API waveform: opens its own mic stream into an AnalyserNode whenever `active`
// flips on, and paints reactive frequency bars onto a canvas in the founder's neon-blue palette.
// Fails silently into a flat canvas if mic permission is denied — voice recognition itself doesn't
// depend on this stream, so a rejected permission here never blocks the response flow.
export default function AudioWaveform({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream; analyser: AnalyserNode } | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = audioRef.current?.analyser;
      const ctx2d = canvas?.getContext("2d");
      if (!canvas || !analyser || !ctx2d) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / BAR_COUNT) || 1;
      const barWidth = canvas.width / BAR_COUNT;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.fillStyle = NEON_BLUE;
      ctx2d.shadowColor = NEON_BLUE;
      ctx2d.shadowBlur = 8;
      for (let i = 0; i < BAR_COUNT; i++) {
        const barHeight = Math.max(3, (data[i * step] / 255) * canvas.height);
        ctx2d.fillRect(i * barWidth + 1, canvas.height - barHeight, barWidth - 2, barHeight);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioRef.current = { ctx, stream, analyser };
        draw();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioRef.current?.stream.getTracks().forEach((t) => t.stop());
      audioRef.current?.ctx.close();
      audioRef.current = null;
    };
  }, [active]);

  return <canvas ref={canvasRef} width={280} height={48} className="w-full max-w-md" />;
}
