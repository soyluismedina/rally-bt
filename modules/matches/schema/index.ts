import { z } from "zod/v4";

export const matchScoreSchema = z.object({
  score1: z.coerce.number().min(0),
  score2: z.coerce.number().min(0),
});

export type MatchScoreFormValues = z.infer<typeof matchScoreSchema>;
