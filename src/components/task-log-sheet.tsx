"use client";

import { useState } from "react";
import { History, UserPlus, UserMinus, ArrowRightLeft, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TaskLog } from "@/lib/schemas";
import { fetchTaskLogs } from "@/app/actions";

const actionConfig: Record<string, { icon: typeof History; label: string; color: string }> = {
  CREATED: { icon: PlusCircle, label: "Criada", color: "text-emerald-500" },
  STATUS_CHANGED: { icon: ArrowRightLeft, label: "Status", color: "text-blue-500" },
  ASSIGNED: { icon: UserPlus, label: "Atribuida", color: "text-violet-500" },
  UNASSIGNED: { icon: UserMinus, label: "Desatribuida", color: "text-amber-500" },
};

function LogEntry({ log }: { log: TaskLog }) {
  const config = actionConfig[log.action] ?? {
    icon: History,
    label: log.action,
    color: "text-muted-foreground",
  };
  const Icon = config.icon;

  return (
    <div className="flex gap-3 py-3">
      <div className={`mt-0.5 shrink-0 ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{log.details}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium">
            {log.userName ?? log.userId.split("@")[0]}
          </span>
          <span className="font-mono">
            {log.createdAt.toLocaleDateString("pt-BR")}{" "}
            {log.createdAt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TaskLogSheet({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function handleOpen(isOpen: boolean) {
    if (isOpen && !loaded) {
      setLoading(true);
      const data = await fetchTaskLogs(taskId);
      setLogs(data);
      setLoaded(true);
      setLoading(false);
    }
    if (!isOpen) {
      setLoaded(false);
    }
  }

  return (
    <Sheet onOpenChange={handleOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-primary"
                  />
                }
              >
                <History className="h-3.5 w-3.5" />
              </SheetTrigger>
            }
          />
          <TooltipContent>Historico</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Historico</SheetTitle>
          <p className="text-sm text-muted-foreground truncate">{taskTitle}</p>
        </SheetHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma atividade registrada
            </p>
          ) : (
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="divide-y">
                {logs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
