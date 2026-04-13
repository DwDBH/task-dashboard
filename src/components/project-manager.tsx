"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  projectSchema,
  type ProjectFormData,
  type Project,
} from "@/lib/schemas";
import { PROJECT_COLORS } from "@/lib/store";
import {
  createProject,
  editProject,
  deleteProjectAction,
} from "@/app/actions";

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROJECT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="relative h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{ backgroundColor: color }}
        >
          {value === color && (
            <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" />
          )}
        </button>
      ))}
    </div>
  );
}

function ProjectRow({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteProjectAction(project.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="group flex items-center justify-between rounded-lg border bg-card px-3 py-2.5"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <span className="text-sm font-medium">{project.name}</span>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-primary"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-destructive"
                disabled={deleting}
              />
            }
          >
            <Trash2 className="h-3.5 w-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
              <AlertDialogDescription>
                O projeto &quot;{project.name}&quot; sera removido. As tarefas
                vinculadas ficaram sem projeto.
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
    </motion.div>
  );
}

function ProjectForm({
  project,
  onDone,
}: {
  project?: Project;
  onDone: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    project?.color ?? PROJECT_COLORS[0]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      color: project?.color ?? PROJECT_COLORS[0],
    },
  });

  async function onSubmit(data: ProjectFormData) {
    setSubmitting(true);
    data.color = selectedColor;
    if (project) {
      await editProject(project.id, data);
    } else {
      await createProject(data);
    }
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Nome</Label>
        <Input
          id="project-name"
          placeholder="Ex: Backend, Frontend, Mobile..."
          {...register("name")}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive"
            >
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <input type="hidden" {...register("color")} value={selectedColor} />
        <ColorPicker value={selectedColor} onChange={setSelectedColor} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {project ? "Salvar" : "Criar projeto"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          <X className="mr-1 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export function ProjectManager({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  function handleEdit(project: Project) {
    setEditingProject(project);
    setMode("edit");
  }

  function handleFormDone() {
    setEditingProject(undefined);
    setMode("list");
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setMode("list");
      setEditingProject(undefined);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" />
        }
      >
        <FolderOpen className="mr-2 h-4 w-4" />
        Projetos
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Novo projeto"
              : mode === "edit"
                ? "Editar projeto"
                : "Projetos"}
          </DialogTitle>
        </DialogHeader>

        {mode === "list" ? (
          <div className="space-y-3">
            <ScrollArea className={projects.length > 5 ? "h-[280px]" : ""}>
              <div className="grid gap-2">
                <AnimatePresence mode="popLayout">
                  {projects.map((project) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      onEdit={() => handleEdit(project)}
                    />
                  ))}
                </AnimatePresence>
                {projects.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum projeto criado
                  </p>
                )}
              </div>
            </ScrollArea>
            <Button
              className="w-full"
              onClick={() => setMode("create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo projeto
            </Button>
          </div>
        ) : (
          <ProjectForm
            project={mode === "edit" ? editingProject : undefined}
            onDone={handleFormDone}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
