import { z } from "zod/v4";

export const playerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

const playerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const duplaSchema = z
  .object({
    player1Id: z.string().min(1, "Seleccioná un jugador"),
    player2Id: z.string().min(1, "Seleccioná un jugador"),
  })
  .refine((data) => data.player1Id !== data.player2Id, {
    message: "Los jugadores deben ser distintos",
    path: ["player2Id"],
  });

export const duplaStorageSchema = z
  .object({
    players: z.array(playerInfoSchema).length(2),
  })
  .refine((data) => data.players[0].id !== data.players[1].id, {
    message: "Los jugadores deben ser distintos",
  });

export type PlayerFormValues = z.infer<typeof playerSchema>;
export type DuplaFormValues = z.infer<typeof duplaSchema>;
