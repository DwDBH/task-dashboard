"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from "@/lib/schemas";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { StatsCards } from "./stats-cards";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

type Filter = "all" | "PENDING" | "IN_PROGRESS" | "DONE";

type DashboardProps = {
  tasks: Task[];
  user: { email: string; name?: string };
};

export function Dashboard({ tasks, user }: DashboardProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Gerencie suas tarefas de desenvolvimento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <TaskForm />
          <UserMenu email={user.email} name={user.name} />
        </div>
      </motion.header>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <StatsCards tasks={tasks} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs
          defaultValue="all"
          onValueChange={(v) => setFilter(v as Filter)}
        >
          <div className="mb-5 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">Em andamento</TabsTrigger>
              <TabsTrigger value="DONE">Concluidas</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={filter}>
            <TaskList tasks={filtered} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
