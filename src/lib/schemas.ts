import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    message: "Selecione a prioridade",
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  updatedAt: Date;
};
