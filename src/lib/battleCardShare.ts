import type { BattleOutcome, StartupCardData } from "../types/battleCard";
import { STAT_ORDER, deriveInsight } from "./battleCardScoring";

const WIDTH = 720;
const HEIGHT = 1029;

const STAT_COLOR: Record<string, string> = {
  innovation: "#fb923c",
  market: "#60a5fa",
  execution: "#4ade80",
  defensibility: "#c084fc",
};

// Draws one stat row (label, track, filled bar, number) at the given y position
function drawStatRow(ctx: CanvasRenderingContext2D, label: string, value: number, y: number) {
  ctx.fillStyle = "#e5e5e5";
  ctx.font = "600 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(label.toUpperCase(), 48, y);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(48, y + 12, 480, 14);
  ctx.fillStyle = STAT_COLOR[label] ?? "#ffffff";
  ctx.fillRect(48, y + 12, (480 * value) / 100, 14);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.fillText(String(value), 624, y);
  ctx.textAlign = "left";
}

// Renders a Pokemon-style PNG of the given startup card onto an off-screen canvas and returns its data URL
export function generateBattleCardDataUrl(card: StartupCardData): string {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 34px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(card.name, 48, 70);
  ctx.fillStyle = "#f87171";
  ctx.font = "900 28px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`HP ${card.hp}`, 672, 66);

  const art = ctx.createLinearGradient(0, 100, 0, 400);
  art.addColorStop(0, "#7c3aed");
  art.addColorStop(1, "#0f0f1a");
  ctx.fillStyle = art;
  ctx.fillRect(48, 100, 624, 300);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "900 160px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(card.name.slice(0, 1).toUpperCase(), WIDTH / 2, 300);

  ctx.fillStyle = "#a3a2a0";
  ctx.font = "italic 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${card.industry} · ${card.businessType}`, 48, 435);

  STAT_ORDER.forEach((stat, i) => drawStatRow(ctx, stat, card[stat], 490 + i * 60));

  ctx.fillStyle = "#f0a020";
  ctx.font = "700 16px sans-serif";
  ctx.fillText("SPECIAL ABILITY", 48, 770);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px sans-serif";
  ctx.fillText(card.specialAbility.name, 48, 800);

  ctx.fillStyle = "#f87171";
  ctx.font = "600 16px sans-serif";
  ctx.fillText(`Weakness: ${card.weakness}`, 48, 900, 624);

  ctx.fillStyle = "#6b6a68";
  ctx.font = "600 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PITCHR", WIDTH / 2, HEIGHT - 40);

  return canvas.toDataURL("image/png");
}

// Renders a shareable PNG for a finished battle: VICTORY/DEFEAT banner, score, and the one-line insight
export function generateBattleResultDataUrl(player: StartupCardData, competitor: StartupCardData, outcome: BattleOutcome): string {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const won = outcome.winner === "player";
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, won ? "#052e16" : "#2e0505");
  bg.addColorStop(1, "#0a0a0f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.textAlign = "center";
  ctx.fillStyle = "#f0a020";
  ctx.font = "700 32px sans-serif";
  ctx.fillText("PITCHR BATTLE CARD", WIDTH / 2, 140);

  ctx.fillStyle = won ? "#4ade80" : "#f87171";
  ctx.font = "900 110px sans-serif";
  ctx.fillText(won ? "VICTORY" : "DEFEAT", WIDTH / 2, 300);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 30px sans-serif";
  ctx.fillText(`${player.name} vs ${competitor.name}`, WIDTH / 2, 380);
  ctx.fillStyle = "#a3a2a0";
  ctx.font = "600 26px sans-serif";
  ctx.fillText(`${outcome.playerWins} — ${outcome.competitorWins} on rounds`, WIDTH / 2, 425);

  ctx.fillStyle = "#e5e5e5";
  ctx.font = "500 24px sans-serif";
  wrapText(ctx, deriveInsight(outcome.rounds), WIDTH / 2, 520, 560, 34);

  return canvas.toDataURL("image/png");
}

// Word-wraps text across multiple centred lines within a max width
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}
