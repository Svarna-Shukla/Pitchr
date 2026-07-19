import { Download } from "lucide-react";
import type { StartupCardData } from "../../types/battleCard";
import { generateBattleCardDataUrl } from "../../lib/battleCardShare";
import { downloadDataUrl } from "../../lib/shareImage";
import Button from "../Button";

type Props = { card: StartupCardData };

// Renders the player's card onto an off-screen canvas and downloads it as a watermarked PNG
export default function ShareCardButton({ card }: Props) {
  // Builds the image and triggers the browser download
  const handleShare = () => {
    const dataUrl = generateBattleCardDataUrl(card);
    if (dataUrl) downloadDataUrl(dataUrl, `pitchr-card-${card.name.toLowerCase().replace(/\s+/g, "-")}.png`);
  };

  return (
    <Button variant="ghost" onClick={handleShare}>
      <Download className="h-4 w-4" /> Share My Card
    </Button>
  );
}
