import { jsPDF } from "jspdf";
import type { Slide } from "../types/slide";

const TYPE_RGB: Record<string, [number, number, number]> = {
  problem: [239, 68, 68],
  solution: [59, 130, 246],
  market: [34, 197, 94],
  traction: [234, 179, 8],
  team: [168, 85, 247],
  ask: [249, 115, 22],
};
const DEFAULT_RGB: [number, number, number] = [200, 200, 200];

// Draws one slide's content onto the current PDF page
function drawSlide(doc: jsPDF, slide: Slide, index: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const [r, g, b] = TYPE_RGB[slide.type] ?? DEFAULT_RGB;
  const margin = 50;

  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, pageW, pageH, "F");
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, 8, pageH, "F");

  doc.setFontSize(40);
  doc.setTextColor(40, 40, 40);
  doc.text(String(index + 1).padStart(2, "0"), margin, 60);

  doc.setFontSize(12);
  doc.setTextColor(r, g, b);
  doc.text(slide.type.toUpperCase(), margin, 90);

  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(slide.title, pageW - margin * 2) as string[];
  doc.text(titleLines, margin, 125);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(220, 220, 220);
  let y = 125 + titleLines.length * 24 + 30;
  for (const bullet of slide.bullets) {
    doc.setFillColor(r, g, b);
    doc.circle(margin + 3, y - 4, 2.5, "F");
    const lines = doc.splitTextToSize(bullet, pageW - margin * 2 - 20) as string[];
    doc.text(lines, margin + 16, y);
    y += lines.length * 18 + 10;
  }

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("EchoDraft", margin, pageH - 24);
}

// Renders every slide as its own dark-themed page and downloads the deck as a PDF
export function exportSlidesToPdf(slides: Slide[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  slides.forEach((slide, i) => {
    if (i > 0) doc.addPage();
    drawSlide(doc, slide, i);
  });
  doc.save("echodraft-pitch-deck.pdf");
}
