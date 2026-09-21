import { createClient } from "@/lib/supabase/server";
import HallOfFameClient from "@/components/HallOfFameClient";
import type { GameRow } from "@/lib/supabase/types";

export default async function HallOfFamePage() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: true });

  return <HallOfFameClient games={(games as GameRow[]) ?? []} />;
}
