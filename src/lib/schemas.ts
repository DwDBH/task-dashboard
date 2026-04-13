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
  projectId: z.string().optional().or(z.literal("")),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectId: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  updatedAt: Date;
};

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
