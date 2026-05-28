import { Dupla } from "@/types/dupla";

const MAX_CANCHAS = 2;

export type MatchData = {
  dupla_1: Dupla;
  dupla_2: Dupla;
  round: number;
  court: number;
};

export function generateMatches(duplas: Dupla[]): MatchData[] {
  if (duplas.length < 2) return [];

  const n = duplas.length;
  const matchesPlayed = new Array(n).fill(0);
  const played = new Set<string>();

  const partidas: MatchData[] = [];
  let ronda = 0;

  const totalMatches = (n * (n - 1)) / 2;

  while (played.size < totalMatches) {
    const rondaActual: [number, number][] = [];
    const ocupadas = new Set<number>();

    const available = Array.from({ length: n }, (_, i) => i).sort(
      (a, b) => matchesPlayed[a] - matchesPlayed[b],
    );

    for (const i of available) {
      if (ocupadas.has(i)) continue;
      if (rondaActual.length >= MAX_CANCHAS) break;

      let bestJ = -1;
      let bestScore = Infinity;

      for (let j = 0; j < n; j++) {
        if (j === i || ocupadas.has(j)) continue;
        const key = i < j ? `${i},${j}` : `${j},${i}`;
        if (played.has(key)) continue;
        if (matchesPlayed[j] < bestScore) {
          bestScore = matchesPlayed[j];
          bestJ = j;
        }
      }

      if (bestJ !== -1) {
        ocupadas.add(i);
        ocupadas.add(bestJ);
        rondaActual.push([i, bestJ]);
        const key = i < bestJ ? `${i},${bestJ}` : `${bestJ},${i}`;
        played.add(key);
      }
    }

    if (rondaActual.length === 0) break;

    rondaActual.forEach(([a, b]) => {
      matchesPlayed[a]++;
      matchesPlayed[b]++;
    });

    rondaActual.forEach(([a, b], ci) => {
      partidas.push({
        dupla_1: duplas[a],
        dupla_2: duplas[b],
        round: ronda,
        court: ci,
      });
    });
    ronda++;
  }

  return partidas;
}
