import { RegisterForm } from "@/components/auth/register-form";
import { LayoutDashboard } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 p-4">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Task Dashboard
        </span>
      </div>
      <RegisterForm />
    </div>
  );
}
