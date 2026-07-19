type ShareCardData = { health: number; questionsSurvived: number; grade: string; personalityName: string };

const WIDTH = 1080;
const HEIGHT = 1350;

// Draws the branded shareable result card onto a fresh off-screen canvas and returns it as a PNG data URL
export function generateShareCardDataUrl({ health, questionsSurvived, grade, personalityName }: ShareCardData): string {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, "#0a0a0b");
  bg.addColorStop(1, "#1a0f05");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.textAlign = "left";
  ctx.fillStyle = "#f0a020";
  ctx.font = "600 42px 'Space Grotesk', sans-serif";
  ctx.fillText("PITCHR", 60, 100);

  ctx.textAlign = "center";
  ctx.fillStyle = "#a3a2a0";
  ctx.font = "400 32px sans-serif";
  ctx.fillText(`Grilled by ${personalityName}`, WIDTH / 2, 220);
  ctx.font = "400 26px sans-serif";
  ctx.fillText(new Date().toLocaleDateString(), WIDTH / 2, 260);

  ctx.fillStyle = "#f2f1ee";
  ctx.font = "900 340px 'Space Grotesk', sans-serif";
  ctx.fillText(grade, WIDTH / 2, 640);

  ctx.fillStyle = "#f2f1ee";
  ctx.font = "600 48px sans-serif";
  ctx.fillText(`${Math.round(health)} PITCH HEALTH REMAINING`, WIDTH / 2, 820);

  ctx.fillStyle = "#a3a2a0";
  ctx.font = "500 40px sans-serif";
  ctx.fillText(`Survived ${questionsSurvived} question${questionsSurvived === 1 ? "" : "s"}`, WIDTH / 2, 880);

  ctx.fillStyle = "#5c5b58";
  ctx.font = "400 28px sans-serif";
  ctx.fillText("pitchr — meet your harshest critic", WIDTH / 2, HEIGHT - 60);

  return canvas.toDataURL("image/png");
}

// Triggers a browser download of a data URL under the given filename
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
