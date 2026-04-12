"use server";

import { revalidatePath } from "next/cache";
import { taskSchema } from "@/lib/schemas";
import { addTask, updateTaskStatus, deleteTask } from "@/lib/store";

export async function createTask(formData: unknown) {
  const parsed = taskSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  addTask({
    title: parsed.data.title,
    description: parsed.data.description || undefined,
    priority: parsed.data.priority,
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
