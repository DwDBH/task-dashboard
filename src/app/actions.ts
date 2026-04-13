"use server";

import { revalidatePath } from "next/cache";
import { taskSchema, projectSchema } from "@/lib/schemas";
import {
  addTask,
  updateTaskStatus,
  deleteTask,
  addProject,
  updateProject,
  deleteProject as removeProject,
} from "@/lib/store";

export async function createTask(formData: unknown, imageUrl?: string) {
  const parsed = taskSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  addTask({
    title: parsed.data.title,
    description: parsed.data.description || undefined,
    imageUrl: imageUrl || undefined,
    priority: parsed.data.priority,
    projectId: parsed.data.projectId || undefined,
  });

  revalidatePath("/");
  return { success: true };
}

export async function changeTaskStatus(id: string, status: string) {
  const validStatuses = ["PENDING", "IN_PROGRESS", "DONE"] as const;
  if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
    return { error: "Status inválido" };
  }

  const task = updateTaskStatus(
    id,
    status as "PENDING" | "IN_PROGRESS" | "DONE"
  );
  if (!task) return { error: "Tarefa não encontrada" };

  revalidatePath("/");
  return { success: true };
}

export async function removeTask(id: string) {
  const deleted = deleteTask(id);
  if (!deleted) return { error: "Tarefa não encontrada" };

  revalidatePath("/");
  return { success: true };
}

export async function createProject(formData: unknown) {
  const parsed = projectSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  addProject({
    name: parsed.data.name,
    color: parsed.data.color,
  });

  revalidatePath("/");
  return { success: true };
}

export async function editProject(id: string, formData: unknown) {
  const parsed = projectSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const project = updateProject(id, {
    name: parsed.data.name,
    color: parsed.data.color,
  });
  if (!project) return { error: "Projeto não encontrado" };

  revalidatePath("/");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  const deleted = removeProject(id);
  if (!deleted) return { error: "Projeto não encontrado" };

  revalidatePath("/");
  return { success: true };
}
