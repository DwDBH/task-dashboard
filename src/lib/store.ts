import type { Task, Project } from "./schemas";

// Project colors available for selection
export const PROJECT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

// In-memory project store
const projects: Project[] = [
  {
    id: "1",
    name: "Backend",
    color: "#3b82f6",
    createdAt: new Date("2026-04-09"),
    updatedAt: new Date("2026-04-09"),
  },
  {
    id: "2",
    name: "Frontend",
    color: "#8b5cf6",
    createdAt: new Date("2026-04-09"),
    updatedAt: new Date("2026-04-09"),
  },
  {
    id: "3",
    name: "DevOps",
    color: "#22c55e",
    createdAt: new Date("2026-04-09"),
    updatedAt: new Date("2026-04-09"),
  },
];

let nextProjectId = 4;

export function getProjects(): Project[] {
  return [...projects].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
}

export function addProject(data: { name: string; color: string }): Project {
  const project: Project = {
    id: String(nextProjectId++),
    name: data.name,
    color: data.color,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  projects.push(project);
  return project;
}

export function updateProject(
  id: string,
  data: { name: string; color: string }
): Project | null {
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  project.name = data.name;
  project.color = data.color;
  project.updatedAt = new Date();
  return project;
}

export function deleteProject(id: string): boolean {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  // Unlink tasks from deleted project
  for (const task of tasks) {
    if (task.projectId === id) {
      task.projectId = null;
    }
  }
  return true;
}

// In-memory task store
const tasks: Task[] = [
  {
    id: "1",
    title: "Configurar Supabase Auth",
    description: "Integrar autenticação com Supabase e criar middleware de proteção de rotas",
    imageUrl: null,
    projectId: "1",
    status: "DONE",
    priority: "HIGH",
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "2",
    title: "Criar API de pagamentos",
    description: "Implementar integração com Stripe para pagamentos internacionais",
    imageUrl: null,
    projectId: "1",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: new Date("2026-04-11"),
    updatedAt: new Date("2026-04-11"),
  },
  {
    id: "3",
    title: "Adicionar cache com Redis",
    description: "Configurar Upstash Redis para rate limiting e cache de sessões",
    imageUrl: null,
    projectId: "3",
    status: "PENDING",
    priority: "MEDIUM",
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-12"),
  },
  {
    id: "4",
    title: "Enviar e-mails de boas-vindas",
    description: "Criar template com React Email e enviar via Resend",
    imageUrl: null,
    projectId: null,
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
  imageUrl?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId?: string;
}): Task {
  const task: Task = {
    id: String(nextId++),
    title: data.title,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    projectId: data.projectId || null,
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
