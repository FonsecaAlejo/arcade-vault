import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/components/HomeContent";
import type { GameRow } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: true });

  return <HomeContent games={(games as GameRow[]) ?? []} />;
}
