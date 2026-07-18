// Safari/older browsers only expose the Web Audio constructor under a vendor prefix
interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Resolves an AudioContext instance across standard and vendor-prefixed browser globals
function createAudioContext(): AudioContext {
  const w = window as WindowWithWebkitAudio;
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  return new Ctor();
}

// Initializes AudioContext and generates a high-to-low frequency sweep for a projectile attack swoosh
export function playSwooshFX(): void {
  const ctx = createAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

// Generates a low-frequency, heavily dampened square wave blast to simulate impact thuds
export function playThudFX(): void {
  const ctx = createAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(90, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}
