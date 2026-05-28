import { Player } from "./player";

export type Match = {
  id: string;
  dupla_1: Player;
  dupla_2: Player;
  score_1: number | null;
  score_2: number | null;
};
