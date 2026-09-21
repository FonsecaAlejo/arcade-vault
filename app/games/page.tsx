import { createClient } from "@/lib/supabase/server";
import GamesGrid from "@/components/GamesGrid";
import type { GameRow } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span>
        </div>
      </section>

      <GamesGrid games={(games as GameRow[]) ?? []} />
    </div>
  );
}
