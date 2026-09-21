import Link from "next/link";
import type { GameRow } from "@/lib/supabase/types";

export default function MiniCard({ game }: { game: GameRow }) {
  return (
    <Link href={`/games/${game.id}`} className="mini-card">
      <div className="mini-cover">
        <div className={"cover-bg " + game.cover} />
      </div>
      <div className="mini-meta">
        <div className="mini-title">{game.title}</div>
        <div className="mini-cat">{game.cat}</div>
      </div>
    </Link>
  );
}
