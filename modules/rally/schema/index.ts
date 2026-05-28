import { z } from "zod/v4";

export const rallySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  date: z.string().min(1, "La fecha es obligatoria"),
  place: z
    .string()
    .min(1, "El lugar es obligatorio")
    .max(200, "El lugar no puede superar los 200 caracteres"),
});

export type RallyFormValues = z.infer<typeof rallySchema>;
