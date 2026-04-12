"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/lib/schemas";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { StatsCards } from "./stats-cards";
import { ThemeToggle } from "./theme-toggle";

type Filter = "all" | "PENDING" | "IN_PROGRESS" | "DONE";

export function Dashboard({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas tarefas de desenvolvimento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TaskForm />
        </div>
      </div>

      <StatsCards tasks={tasks} />

      <Separator />

      <Tabs
        defaultValue="all"
        onValueChange={(v) => setFilter(v as Filter)}
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">Andamento</TabsTrigger>
          <TabsTrigger value="DONE">Concluídas</TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-4">
          <TaskList tasks={filtered} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
