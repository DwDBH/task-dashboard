import { prisma } from "./prisma";

// ── Projects ──

export function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export function addProject(data: { name: string; color: string; userId: string }) {
  return prisma.project.create({ data });
}

export function updateProject(id: string, userId: string, data: { name: string; color: string }) {
  return prisma.project.updateMany({
    where: { id, userId },
    data: { ...data, updatedAt: new Date() },
  });
}

export function deleteProject(id: string, userId: string) {
  return prisma.$transaction([
    prisma.task.updateMany({
      where: { projectId: id },
      data: { projectId: null },
    }),
    prisma.project.deleteMany({
      where: { id, userId },
    }),
  ]);
}

// ── Tasks ──

export function getTasks(userId: string) {
  return prisma.task.findMany({
    where: {
      OR: [
        { userId },
        { assignedTo: userId },
      ],
    },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
}

export function addTask(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId?: string;
  userId: string;
  userName?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        priority: data.priority,
        projectId: data.projectId || null,
        userId: data.userId,
      },
    });
    await tx.taskLog.create({
      data: {
        taskId: task.id,
        userId: data.userId,
        userName: data.userName,
        action: "CREATED",
        details: `Tarefa criada: "${task.title}"`,
      },
    });
    return task;
  });
}

export function updateTaskStatus(
  id: string,
  userId: string,
  userName: string | undefined,
  status: "PENDING" | "IN_PROGRESS" | "DONE"
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id,
        OR: [{ userId }, { assignedTo: userId }],
      },
    });
    if (!task) return null;

    const updated = await tx.task.update({
      where: { id },
      data: { status },
    });

    const statusLabels: Record<string, string> = {
      PENDING: "Pendente",
      IN_PROGRESS: "Em andamento",
      DONE: "Concluida",
    };

    await tx.taskLog.create({
      data: {
        taskId: id,
        userId,
        userName,
        action: "STATUS_CHANGED",
        details: `Status alterado para "${statusLabels[status]}"`,
      },
    });
    return updated;
  });
}

export function assignTask(
  id: string,
  userId: string,
  userName: string | undefined,
  assignedToEmail: string
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: { id, userId },
    });
    if (!task) return null;

    const updated = await tx.task.update({
      where: { id },
      data: { assignedTo: assignedToEmail },
    });

    await tx.taskLog.create({
      data: {
        taskId: id,
        userId,
        userName,
        action: "ASSIGNED",
        details: `Tarefa atribuida para ${assignedToEmail}`,
      },
    });
    return updated;
  });
}

export function unassignTask(
  id: string,
  userId: string,
  userName: string | undefined
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id,
        OR: [{ userId }, { assignedTo: userId }],
      },
    });
    if (!task) return null;

    const updated = await tx.task.update({
      where: { id },
      data: { assignedTo: null },
    });

    await tx.taskLog.create({
      data: {
        taskId: id,
        userId,
        userName,
        action: "UNASSIGNED",
        details: "Atribuicao removida",
      },
    });
    return updated;
  });
}

export function deleteTask(id: string, userId: string, userName?: string) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: { id, userId },
    });
    if (!task) return false;

    await tx.taskLog.deleteMany({ where: { taskId: id } });
    await tx.task.delete({ where: { id } });
    return true;
  });
}

// ── Task Logs ──

export function getTaskLogs(taskId: string) {
  return prisma.taskLog.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
}
