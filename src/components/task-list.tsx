"use client";

import { AnimatePresence } from "framer-motion";
import type { Task } from "@/lib/schemas";
import { TaskCard } from "./task-card";

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid gap-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
      {tasks.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma tarefa encontrada. Crie uma nova tarefa para começar.
          </p>
        </div>
      )}
    </div>
  );
}
