type Standing = {
  duplaId: string;
  player1Name: string;
  player2Name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
};

const rankColors = [
  "bg-yellow-400 text-yellow-900",
  "bg-slate-300 text-slate-700",
  "bg-amber-700 text-amber-100",
];

export default function StandingsTable({
  standings,
}: {
  standings: Standing[];
}) {
  if (standings.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
        No hay resultados disponibles
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 sm:mx-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10">
              #
            </th>
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Dupla
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              PJ
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
              PG
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
              PP
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              PF
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
              PC
            </th>
            <th className="text-center px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              DIF
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {standings.map((s, i) => {
            const diff = s.pointsFor - s.pointsAgainst;
            return (
              <tr
                key={s.duplaId}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-3">
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      i < 3 ? rankColors[i] : "text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {s.player1Name} & {s.player2Name}
                  </span>
                </td>
                <td className="px-2 py-3 text-center text-sm font-medium text-slate-700">
                  {s.matchesPlayed}
                </td>
                <td className="px-2 py-3 text-center text-sm font-medium text-slate-700 hidden sm:table-cell">
                  {s.wins}
                </td>
                <td className="px-2 py-3 text-center text-sm font-medium text-slate-700 hidden sm:table-cell">
                  {s.losses}
                </td>
                <td className="px-2 py-3 text-center text-sm font-medium text-emerald-600">
                  {s.pointsFor}
                </td>
                <td className="px-2 py-3 text-center text-sm font-medium text-red-500 hidden sm:table-cell">
                  {s.pointsAgainst}
                </td>
                <td className="px-2 py-3 text-center">
                  <span
                    className={`text-sm font-bold ${
                      diff > 0
                        ? "text-emerald-600"
                        : diff < 0
                          ? "text-red-500"
                          : "text-slate-400"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
