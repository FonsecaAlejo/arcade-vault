"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/session";
import type { GameRow, ScoreRow } from "@/lib/supabase/types";

export default function HallOfFameClient({ games }: { games: GameRow[] }) {
  const { user } = useSession();
  const [tab, setTab] = useState(games[0]?.id ?? "");
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [youScore, setYouScore] = useState<ScoreRow | null>(null);

  const game = useMemo(() => games.find((g) => g.id === tab) ?? null, [games, tab]);

  useEffect(() => {
    if (!tab) return;
    const supabase = createClient();
    let cancelled = false;

    supabase
      .from("scores")
      .select("*")
      .eq("game_id", tab)
      .order("score", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (!cancelled) setRows((data as ScoreRow[]) ?? []);
      });

    if (user) {
      supabase
        .from("scores")
        .select("*")
        .eq("game_id", tab)
        .ilike("player_name", user.name)
        .order("score", { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (!cancelled) setYouScore((data as ScoreRow[])?.[0] ?? null);
        });
    } else {
      setYouScore(null);
    }

    return () => {
      cancelled = true;
    };
  }, [tab, user]);

  if (!game) {
    return (
      <div className="av-hall fade-in">
        <div className="hall-head">
          <h1>SALÓN DE LA FAMA</h1>
        </div>
        <div style={{ textAlign: "center", padding: 80, color: "var(--ink-faint)" }}>
          Todavía no hay juegos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>SALÓN DE LA FAMA</h1>
        <p className="pixel" style={{ fontSize: 10 }}>
          LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA
        </p>
      </div>

      <div className="hall-tabs">
        {games.map((g) => (
          <button
            key={g.id}
            className={"chip" + (tab === g.id ? " active" : "")}
            onClick={() => setTab(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--ink-faint)" }}>
          <div className="pixel" style={{ fontSize: 14, color: "var(--magenta)", marginBottom: 12 }}>
            SIN PUNTUACIONES
          </div>
          <div>Sé el primero en entrar al salón de la fama</div>
        </div>
      ) : (
        <>
          <div className="podium">
            {rows[1] && (
              <div className="podium-slot silver">
                <div className="rank-num">02</div>
                <div className="name">{rows[1].player_name}</div>
                <div className="score">{rows[1].score.toLocaleString("es-ES")}</div>
                <div className="date">{new Date(rows[1].created_at).toLocaleDateString("es-ES")}</div>
              </div>
            )}
            <div className="podium-slot gold">
              <div className="pixel" style={{ fontSize: 9, color: "var(--gold)", letterSpacing: "0.18em" }}>
                CAMPEÓN
              </div>
              <div className="rank-num" style={{ fontSize: 36, marginTop: 4 }}>01</div>
              <div className="name">{rows[0].player_name}</div>
              <div className="score" style={{ fontSize: 20 }}>{rows[0].score.toLocaleString("es-ES")}</div>
              <div className="date">{new Date(rows[0].created_at).toLocaleDateString("es-ES")}</div>
            </div>
            {rows[2] && (
              <div className="podium-slot bronze">
                <div className="rank-num">03</div>
                <div className="name">{rows[2].player_name}</div>
                <div className="score">{rows[2].score.toLocaleString("es-ES")}</div>
                <div className="date">{new Date(rows[2].created_at).toLocaleDateString("es-ES")}</div>
              </div>
            )}
          </div>

          <div className="hall-table">
            <div className="th">
              <div>RANGO</div>
              <div>JUGADOR</div>
              <div>PUNTUACIÓN</div>
              <div>FECHA</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.id}
                className={"tr" + (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="rk">#{String(i + 1).padStart(2, "0")}</div>
                <div className="pl">{r.player_name}</div>
                <div className="sc">{r.score.toLocaleString("es-ES")}</div>
                <div className="dt">{new Date(r.created_at).toLocaleDateString("es-ES")}</div>
              </div>
            ))}
            {youScore && (
              <>
                <div className="tr you-label">▸ TU MEJOR MARCA EN {game.title}</div>
                <div className="tr you" style={{ animationDelay: `${rows.length * 50 + 50}ms` }}>
                  <div className="rk" style={{ color: "var(--yellow)" }}>
                    {rows.findIndex((r) => r.id === youScore.id) >= 0
                      ? `#${String(rows.findIndex((r) => r.id === youScore.id) + 1).padStart(2, "0")}`
                      : "—"}
                  </div>
                  <div className="pl" style={{ color: "var(--yellow)" }}>{youScore.player_name}</div>
                  <div className="sc" style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}>
                    {youScore.score.toLocaleString("es-ES")}
                  </div>
                  <div className="dt">{new Date(youScore.created_at).toLocaleDateString("es-ES")}</div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/" className="btn lg">VOLVER A LA BIBLIOTECA</Link>
      </div>
    </div>
  );
}
