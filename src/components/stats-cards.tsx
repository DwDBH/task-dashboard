"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, ListTodo } from "lucide-react";
import type { Task } from "@/lib/schemas";

export function StatsCards({ tasks }: { tasks: Task[] }) {
  const stats = [
    {
      label: "Total",
      value: tasks.length,
      icon: ListTodo,
      bg: "bg-primary/8",
      iconColor: "text-primary",
    },
    {
      label: "Pendentes",
      value: tasks.filter((t) => t.status === "PENDING").length,
      icon: Circle,
      bg: "bg-amber-500/8",
      iconColor: "text-amber-600",
    },
    {
      label: "Em andamento",
      value: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      icon: Clock,
      bg: "bg-blue-500/8",
      iconColor: "text-blue-600",
    },
    {
      label: "Concluidas",
      value: tasks.filter((t) => t.status === "DONE").length,
      icon: CheckCircle2,
      bg: "bg-emerald-500/8",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          className="group rounded-xl border bg-card p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight font-mono leading-none">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
