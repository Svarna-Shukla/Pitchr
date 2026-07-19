import { Swords } from "lucide-react";
import type { StartupCardData } from "../../types/battleCard";
import StartupCard from "./card/StartupCard";
import CardSkeleton from "./card/CardSkeleton";
import Button from "../Button";

type Props = { competitors: StartupCardData[]; isGenerating: boolean; failed: boolean; onRetry: () => void; onBattle: (c: StartupCardData) => void };

// The row of 3 competitor cards below the player's card, each with its own BATTLE button — handles the
// generating-skeleton and failed-with-retry states so the parent view stays purely layout
export default function CompetitorsRow({ competitors, isGenerating, failed, onRetry, onBattle }: Props) {
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-sm text-red-400">Couldn't find real-world competitors.</p>
        <Button variant="ghost" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {isGenerating
        ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)
        : competitors.map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-3">
              <StartupCard card={c} badge="Competitor" />
              <Button onClick={() => onBattle(c)} className="min-h-11">
                <Swords className="h-4 w-4" /> Battle
              </Button>
            </div>
          ))}
    </div>
  );
}
