import { createElement } from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import SlideCard from "../components/deck/premium/SlideCard";
import type { Slide } from "../types/slide";
import type { FounderKit } from "../types/founderKit";
import type { Theme } from "../hooks/useTheme";
import type { SlideTheme } from "./premiumSlideTheme";
import { SLIDE_PALETTES } from "./premiumSlideTheme";

const PAGE_W = 960;
const PAGE_H = 540; // true 16:9 landscape
const CAPTURE_W = 1920;
const CAPTURE_H = 1080;
const CAPTURE_TIMEOUT_MS = 15000;

type RGB = [number, number, number];

// Waits two animation frames, letting React commit and layout (recharts' ResponsiveContainer in
// particular) settle before the DOM is rasterized
function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

// Mounts one slide off-screen at fixed capture dimensions (the same PremiumSlide Presentation Mode
// renders, so the PDF is byte-for-byte what's on screen), rasterizes it, and returns a JPEG data URL.
// JPEG (not PNG) is deliberate: jsPDF embeds PNG image data almost uncompressed, which blows a 6-slide
// deck up to tens of megabytes — these slides are opaque and mostly flat colour, so JPEG at high
// quality is visually lossless here while producing a file over an order of magnitude smaller.
async function captureSlide(slide: Slide, index: number, total: number, slideTheme: SlideTheme): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.width = `${CAPTURE_W}px`;
  container.style.height = `${CAPTURE_H}px`;
  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    root.render(createElement(SlideCard, { slide, index, total, context: "pdf", slideTheme }));
    await nextPaint();

    // html2canvas occasionally never settles on a given element (an upstream quirk, not tied to
    // any particular slide layout) — race it against a timeout so one bad slide can't hang the
    // whole export forever
    // scale: 2 forces a high-DPI backing canvas regardless of the exporting machine's own
    // devicePixelRatio, so the PDF matches what a Retina/high-DPI screen shows rather than
    // whatever the export happens to run on
    const canvas = await Promise.race([
      html2canvas(container, { backgroundColor: SLIDE_PALETTES[slideTheme].background, scale: 2 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Slide ${index + 1} capture timed out`)), CAPTURE_TIMEOUT_MS)),
    ]);
    root.unmount();
    return canvas.toDataURL("image/jpeg", 0.92);
  } finally {
    container.remove();
  }
}

// Renders every slide as its own 16:9 page by rasterizing the live SlideCard component (charts,
// custom typography, and the current slide theme all capture faithfully this way), one slide at a
// time so captures never race each other, and downloads the deck as a PDF
export async function exportSlidesToPdf(slides: Slide[], slideTheme: SlideTheme = "neon"): Promise<void> {
  await document.fonts.ready;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [PAGE_W, PAGE_H] });
  for (let i = 0; i < slides.length; i++) {
    const dataUrl = await captureSlide(slides[i], i, slides.length, slideTheme);
    if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");
    doc.addImage(dataUrl, "JPEG", 0, 0, PAGE_W, PAGE_H);
  }
  doc.save("pitchr-pitch-deck.pdf");
}

const FOUNDER_KIT_MARGIN = 56;

// Draws one Founder Kit document as its own page
function drawFounderKitPage(doc: jsPDF, label: string, content: string | string[], isDark: boolean) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...(isDark ? ([11, 11, 18] as RGB) : ([255, 255, 255] as RGB)));
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFontSize(11);
  doc.setTextColor(168, 85, 247);
  doc.text(label.toUpperCase(), FOUNDER_KIT_MARGIN, 70);

  doc.setFontSize(15);
  doc.setTextColor(...(isDark ? ([255, 255, 255] as RGB) : ([17, 17, 17] as RGB)));
  const text = Array.isArray(content) ? content.map((c) => `- ${c}`).join("\n") : content;
  const lines = doc.splitTextToSize(text, pageW - FOUNDER_KIT_MARGIN * 2) as string[];
  doc.text(lines, FOUNDER_KIT_MARGIN, 100);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Pitchr", FOUNDER_KIT_MARGIN, pageH - 30);
}

// Renders every Founder Kit document as its own page and downloads the bundle as a PDF
export function exportFounderKitToPdf(kit: FounderKit, theme: Theme = "dark") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const isDark = theme === "dark";
  const cards: { label: string; content: string | string[] }[] = [
    { label: "One-liner", content: kit.oneLiner },
    { label: "Elevator pitch — 15 sec", content: kit.elevatorPitch.fifteenSec },
    { label: "Elevator pitch — 30 sec", content: kit.elevatorPitch.thirtySec },
    { label: "Elevator pitch — 60 sec", content: kit.elevatorPitch.sixtySec },
    { label: "Problem statement", content: kit.problemStatement },
    { label: "Target customer", content: kit.targetCustomer },
    { label: "Value proposition", content: kit.valueProposition },
    { label: "GTM strategy", content: kit.gtmStrategy },
    { label: "Validation questions", content: kit.validationQuestions },
    {
      label: "SWOT analysis",
      content: [
        `Strengths: ${kit.swot.strengths.join("; ")}`,
        `Weaknesses: ${kit.swot.weaknesses.join("; ")}`,
        `Opportunities: ${kit.swot.opportunities.join("; ")}`,
        `Threats: ${kit.swot.threats.join("; ")}`,
      ],
    },
    { label: "Risk assessment", content: kit.riskAssessment },
    { label: "Financial projections", content: kit.financialProjections },
    { label: "Landing page copy", content: kit.landingPageCopy },
    { label: "Investor email", content: kit.investorEmail },
    { label: "Press release", content: kit.pressRelease },
    { label: "LinkedIn announcement", content: kit.linkedinAnnouncement },
    { label: "Narration script", content: kit.narrationScript },
  ];
  cards.forEach((card, i) => {
    if (i > 0) doc.addPage();
    drawFounderKitPage(doc, card.label, card.content, isDark);
  });
  doc.save("pitchr-founder-kit.pdf");
}

// Renders a single Founder Kit document as a one-page PDF (used by each card's individual download button)
export function exportSingleFounderKitDoc(label: string, content: string | string[], theme: Theme = "dark") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  drawFounderKitPage(doc, label, content, theme === "dark");
  doc.save(`pitchr-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
}
