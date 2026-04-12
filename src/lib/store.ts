import type { Task } from "./schemas";

// In-memory store for demo (replace with Prisma + Supabase in production)
const tasks: Task[] = [
  {
    id: "1",
    title: "Configurar Supabase Auth",
    description: "Integrar autenticação com Supabase e criar middleware de proteção de rotas",
    status: "DONE",
    priority: "HIGH",
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "2",
    title: "Criar API de pagamentos",
    description: "Implementar integração com Stripe para pagamentos internacionais",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: new Date("2026-04-11"),
    updatedAt: new Date("2026-04-11"),
  },
  {
    id: "3",
    title: "Adicionar cache com Redis",
    description: "Configurar Upstash Redis para rate limiting e cache de sessões",
    status: "PENDING",
    priority: "MEDIUM",
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-12"),
  },
  {
    id: "4",
    title: "Enviar e-mails de boas-vindas",
    description: "Criar template com React Email e enviar via Resend",
    status: "PENDING",
    priority: "LOW",
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-12"),
  },
];

let nextId = 5;

export function getTasks(): Task[] {
  return [...tasks].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function addTask(data: {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}): Task {
  const task: Task = {
    id: String(nextId++),
    title: data.title,
    description: data.description || null,
    status: "PENDING",
    priority: data.priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(task);
  return task;
}

export function updateTaskStatus(
  id: string,
  status: Task["status"]
): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = status;
  task.updatedAt = new Date();
  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
