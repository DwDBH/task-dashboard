"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/lib/schemas";

export function StatsCards({ tasks }: { tasks: Task[] }) {
  const stats = [
    {
      label: "Total",
      value: tasks.length,
      icon: ListTodo,
      color: "text-foreground",
    },
    {
      label: "Pendentes",
      value: tasks.filter((t) => t.status === "PENDING").length,
      icon: Circle,
      color: "text-muted-foreground",
    },
    {
      label: "Em andamento",
      value: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Concluídas",
      value: tasks.filter((t) => t.status === "DONE").length,
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
