import { Dupla } from "./dupla";

export type Match = {
  id: string;
  dupla_1: Dupla;
  dupla_2: Dupla;
  score_1: number | null;
  score_2: number | null;
  round: number;
  court: number;
  winner_id: string;
};
