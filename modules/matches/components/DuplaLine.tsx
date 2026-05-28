import { Dupla } from "@/types/dupla";

export default function DuplaLine({
  duplaId,
  dupla,
  winnerId,
}: {
  duplaId: string;
  dupla: Dupla;
  winnerId: string;
}) {
  const isWinner = winnerId === duplaId;
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
        isWinner
          ? "bg-teal-100 ring-2 ring-teal-400 ring-offset-1"
          : "hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2">
          <span className="w-7 h-7 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {dupla.player_1.name.charAt(0).toUpperCase()}
          </span>
          <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {dupla.player_2.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-800 truncate">
          {dupla.player_1.name} & {dupla.player_2.name}
        </span>
      </div>
      {isWinner && (
        <span className="text-[10px] font-bold text-teal-700 bg-teal-200/60 px-2 py-0.5 rounded-full shrink-0">
          GANADOR
        </span>
      )}
    </div>
  );
}
