"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, Project } from "@/lib/schemas";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";
import { StatsCards } from "./stats-cards";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { ProjectManager } from "./project-manager";

type Filter = "all" | "PENDING" | "IN_PROGRESS" | "DONE";

type DashboardProps = {
  tasks: Task[];
  projects: Project[];
  user: { email: string; name?: string };
};

export function Dashboard({ tasks, projects, user }: DashboardProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const filteredByProject =
    projectFilter === "all"
      ? tasks
      : projectFilter === "__none__"
        ? tasks.filter((t) => !t.projectId)
        : tasks.filter((t) => t.projectId === projectFilter);

  const filtered =
    filter === "all"
      ? filteredByProject
      : filteredByProject.filter((t) => t.status === filter);

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
          <ProjectManager projects={projects} />
          <TaskForm projects={projects} />
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
        <StatsCards tasks={filteredByProject} />
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
          <div className="mb-5 flex items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">Em andamento</TabsTrigger>
              <TabsTrigger value="DONE">Concluidas</TabsTrigger>
            </TabsList>
            <Select
              defaultValue="all"
              onValueChange={(v) => setProjectFilter(v ?? "all")}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrar projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                <SelectItem value="__none__">Sem projeto</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TabsContent value={filter}>
            <TaskList tasks={filtered} projects={projects} userEmail={user.email} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
