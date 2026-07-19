import type { StartupCardData } from "../../types/battleCard";
import StartupCard from "./card/StartupCard";
import CompetitorsRow from "./CompetitorsRow";
import ShareCardButton from "./ShareCardButton";
import CopyLinkButton from "./CopyLinkButton";

type Props = {
  player: StartupCardData;
  competitors: StartupCardData[];
  competitorsGenerating: boolean;
  competitorsFailed: boolean;
  onRetryCompetitors: () => void;
  onBattle: (c: StartupCardData) => void;
  onReset: () => void;
};

// Cards view: the player's card on top with share/copy actions, the 3 competitor cards in a row below
// each with its own Battle button, and a Start Over link back to a blank quiz
export default function CardsView({ player, competitors, competitorsGenerating, competitorsFailed, onRetryCompetitors, onBattle, onReset }: Props) {
  return (
    <div className="flex flex-col items-center gap-10 px-4 pb-24 pt-4">
      <div className="flex flex-col items-center gap-4">
        <StartupCard card={player} badge="Your Company" />
        <div className="flex flex-wrap justify-center gap-3">
          <ShareCardButton card={player} />
          <CopyLinkButton />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-white/40">Top 3 Competitors</p>
        <CompetitorsRow
          competitors={competitors}
          isGenerating={competitorsGenerating}
          failed={competitorsFailed}
          onRetry={onRetryCompetitors}
          onBattle={onBattle}
        />
      </div>

      <button onClick={onReset} className="min-h-11 text-sm font-semibold text-white/40 underline transition hover:text-white/70">
        Start Over
      </button>
    </div>
  );
}
