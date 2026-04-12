"use client";

import { motion } from "framer-motion";
import { Trash2, ArrowRight, Clock, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  },
  IN_PROGRESS: {
    label: "Em andamento",
    variant: "default" as const,
    icon: Clock,
  },
  DONE: {
    label: "Concluída",
    variant: "outline" as const,
    icon: CheckCircle2,
  },
};

const priorityConfig = {
  LOW: { label: "Baixa", className: "text-muted-foreground" },
  MEDIUM: { label: "Média", className: "text-yellow-500" },
  HIGH: { label: "Alta", className: "text-destructive" },
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
  const StatusIcon = status.icon;

  async function handleStatusChange(newStatus?: Task["status"]) {
    setLoading(true);
    await changeTaskStatus(task.id, newStatus ?? nextStatus[task.status]);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await removeTask(task.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`transition-colors ${task.status === "DONE" ? "opacity-60" : ""}`}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex-1 space-y-1">
            <CardTitle
              className={`text-sm font-medium leading-tight ${task.status === "DONE" ? "line-through" : ""}`}
            >
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="cursor-pointer"
                render={
                  <Badge
                    variant={status.variant}
                    className="text-xs"
                  />
                }
              >
                <StatusIcon className="mr-1 h-3 w-3" />
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
        </CardHeader>
        <CardContent>
          {task.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-md">
              <Image
                src={task.imageUrl}
                alt={task.title}
                width={400}
                height={200}
                className="w-full h-32 object-cover"
                unoptimized
              />
            </div>
          )}
          {task.description && (
            <p className="mb-3 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${priority.className}`}>
                {priority.label}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {task.createdAt.toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {task.status !== "DONE" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
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
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
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
                      Essa ação não pode ser desfeita. A tarefa &quot;
                      {task.title}&quot; será removida permanentemente.
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
