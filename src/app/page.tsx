import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTasks } from "@/lib/store";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const tasks = getTasks();

  return (
    <main className="min-h-screen">
      <Dashboard
        tasks={tasks}
        user={{
          email: user.email!,
          name: user.user_metadata?.name,
        }}
      />
    </main>
  );
}
