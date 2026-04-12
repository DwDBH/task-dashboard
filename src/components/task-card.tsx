"use client";

import { motion } from "framer-motion";
import {
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { Task } from "@/lib/schemas";
import { changeTaskStatus, removeTask } from "@/app/actions";

const statusConfig = {
  PENDING: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Circle,
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "Em andamento",
    variant: "default" as const,
    icon: Clock,
    dot: "bg-blue-500",
  },
  DONE: {
    label: "Concluida",
    variant: "outline" as const,
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
};

const priorityConfig = {
  LOW: { label: "Baixa", className: "text-muted-foreground", dot: "bg-muted-foreground/50" },
  MEDIUM: { label: "Media", className: "text-amber-600", dot: "bg-amber-500" },
  HIGH: { label: "Alta", className: "text-red-600", dot: "bg-red-500" },
};

const nextStatus: Record<Task["status"], Task["status"]> = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "PENDING",
};

export function TaskCard({ task }: { task: Task }) {
  const [loading, setLoading] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  async function handleStatusChange(newStatus?: Task["status"]) {
    setLoading(true);
    await changeTaskStatus(task.id, newStatus ?? nextStatus[task.status]);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await removeTask(task.id);
  }

  const isDone = task.status === "DONE";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        className={`group rounded-xl border bg-card shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_3px_12px_0_rgba(0,0,0,0.06)] ${isDone ? "opacity-55" : ""}`}
      >
        {/* Image */}
        {task.imageUrl && (
          <div className="overflow-hidden rounded-t-xl">
            <Image
              src={task.imageUrl}
              alt={task.title}
              width={600}
              height={240}
              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized
            />
          </div>
        )}

        <div className="p-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${status.dot}`}
              />
              <h3
                className={`text-sm font-medium leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </h3>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="cursor-pointer shrink-0"
                render={
                  <Badge
                    variant={status.variant}
                    className="text-[11px] font-medium"
                  />
                }
              >
                {status.label}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(
                  Object.entries(statusConfig) as [
                    Task["status"],
                    (typeof statusConfig)[Task["status"]],
                  ][]
                ).map(([key, config]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleStatusChange(key)}
                    disabled={key === task.status}
                  >
                    <config.icon className="mr-2 h-4 w-4" />
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="mt-1.5 ml-[18px] text-[13px] leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-3 ml-[18px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${priority.dot}`}
                />
                <span className={priority.className}>{priority.label}</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {task.createdAt.toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {!isDone && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => handleStatusChange()}
                  disabled={loading}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={loading}
                    />
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa acao nao pode ser desfeita. A tarefa &quot;
                      {task.title}&quot; sera removida permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
