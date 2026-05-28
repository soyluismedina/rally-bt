const MAX_CANCHAS = 2;

export type MatchData = { dupla1Idx: number; dupla2Idx: number; round: number; court: number };

export function generateMatches(cantidadDuplas: number): MatchData[] {
  if (cantidadDuplas < 2) return [];

  const todosPares: [number, number][] = [];
  for (let i = 0; i < cantidadDuplas; i++) {
    for (let j = i + 1; j < cantidadDuplas; j++) {
      todosPares.push([i, j]);
    }
  }

  const partidas: MatchData[] = [];
  const pendientes = [...todosPares];
  let ronda = 0;

  while (pendientes.length > 0) {
    const rondaActual: [number, number][] = [];
    const ocupadas = new Set<number>();

    for (let i = 0; i < pendientes.length && rondaActual.length < MAX_CANCHAS; i++) {
      const [a, b] = pendientes[i];
      if (!ocupadas.has(a) && !ocupadas.has(b)) {
        ocupadas.add(a);
        ocupadas.add(b);
        rondaActual.push([a, b]);
        pendientes.splice(i, 1);
        i--;
      }
    }

    if (rondaActual.length === 0) break;

    rondaActual.forEach(([a, b], ci) => {
      partidas.push({ dupla1Idx: a, dupla2Idx: b, round: ronda, court: ci });
    });
    ronda++;
  }

  return partidas;
}
