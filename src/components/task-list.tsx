"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 py-14"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhuma tarefa
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crie uma nova tarefa para comecar
          </p>
        </motion.div>
      )}
    </div>
  );
}
