import { Share2 } from "lucide-react";
import Button from "../Button";
import { downloadDataUrl, generateShareCardDataUrl } from "../../lib/shareImage";

type Props = { health: number; questionsSurvived: number; grade: string; personalityName: string };

// Generates a branded shareable result card (via Canvas) and downloads it as a PNG the founder can
// post — final health remaining, questions survived, letter grade, Pitchr branding
export default function ShareButton({ health, questionsSurvived, grade, personalityName }: Props) {
  // Draws the share card and triggers a download
  const handleShare = () => {
    const dataUrl = generateShareCardDataUrl({ health, questionsSurvived, grade, personalityName });
    if (dataUrl) downloadDataUrl(dataUrl, "pitchr-result.png");
  };

  return (
    <Button variant="ghost" onClick={handleShare} className="flex-1">
      <Share2 className="h-4 w-4" /> Share
    </Button>
  );
}
