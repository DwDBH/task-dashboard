"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { register as registerAction } from "@/app/(auth)/actions";

export function RegisterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setSubmitting(true);
    setServerError(null);

    const result = await registerAction(data);

    if (result?.error) {
      const formError =
        "_form" in result.error
          ? (result.error._form as string[])?.[0]
          : "Erro ao criar conta";
      setServerError(formError ?? "Erro ao criar conta");
    }

    setSubmitting(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold">Criar conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha os dados para comecar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg bg-destructive/8 px-3 py-2.5 text-sm text-destructive"
            >
              {serverError}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium">
              Nome
            </Label>
            <Input
              id="name"
              placeholder="Seu nome"
              className="h-10"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-10"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 caracteres"
                className="h-10"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirmar
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                className="h-10"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="h-10 w-full"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Criar conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Ja tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Entrar
        </Link>
      </p>
    </motion.div>
  );
}
