"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { taskSchema, projectSchema, assignSchema } from "@/lib/schemas";
import {
  addTask,
  updateTaskStatus,
  deleteTask,
  assignTask,
  unassignTask,
  addProject,
  updateProject,
  deleteProject as removeProjectFromDB,
  getTaskLogs,
} from "@/lib/store";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nao autenticado");
  return user;
}

// ── Tasks ──

export async function createTask(formData: unknown, imageUrl?: string) {
  const user = await getUser();
  const parsed = taskSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await addTask({
    title: parsed.data.title,
    description: parsed.data.description || undefined,
    imageUrl: imageUrl || undefined,
    priority: parsed.data.priority,
    projectId: parsed.data.projectId || undefined,
    userId: user.email!,
    userName: user.user_metadata?.name,
  });

  revalidatePath("/");
  return { success: true };
}

export async function changeTaskStatus(id: string, status: string) {
  const user = await getUser();
  const validStatuses = ["PENDING", "IN_PROGRESS", "DONE"] as const;
  if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
    return { error: "Status invalido" };
  }

  const task = await updateTaskStatus(
    id,
    user.email!,
    user.user_metadata?.name,
    status as "PENDING" | "IN_PROGRESS" | "DONE"
  );
  if (!task) return { error: "Tarefa nao encontrada" };

  revalidatePath("/");
  return { success: true };
}

export async function removeTask(id: string) {
  const user = await getUser();
  const deleted = await deleteTask(id, user.email!, user.user_metadata?.name);
  if (!deleted) return { error: "Tarefa nao encontrada" };

  revalidatePath("/");
  return { success: true };
}

export async function assignTaskToUser(id: string, formData: unknown) {
  const user = await getUser();
  const parsed = assignSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const task = await assignTask(
    id,
    user.email!,
    user.user_metadata?.name,
    parsed.data.email
  );
  if (!task) return { error: "Tarefa nao encontrada ou sem permissao" };

  revalidatePath("/");
  return { success: true };
}

export async function unassignTaskFromUser(id: string) {
  const user = await getUser();
  const task = await unassignTask(id, user.email!, user.user_metadata?.name);
  if (!task) return { error: "Tarefa nao encontrada" };

  revalidatePath("/");
  return { success: true };
}

export async function fetchTaskLogs(taskId: string) {
  await getUser();
  const logs = await getTaskLogs(taskId);
  return logs;
}

// ── Projects ──

export async function createProject(formData: unknown) {
  const user = await getUser();
  const parsed = projectSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await addProject({
    name: parsed.data.name,
    color: parsed.data.color,
    userId: user.email!,
  });

  revalidatePath("/");
  return { success: true };
}

export async function editProject(id: string, formData: unknown) {
  const user = await getUser();
  const parsed = projectSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await updateProject(id, user.email!, {
    name: parsed.data.name,
    color: parsed.data.color,
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  const user = await getUser();
  await removeProjectFromDB(id, user.email!);

  revalidatePath("/");
  return { success: true };
}
