import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTasks, getProjects } from "@/lib/store";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user.email!;
  const [tasks, projects] = await Promise.all([
    getTasks(userId),
    getProjects(userId),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <Dashboard
        tasks={tasks}
        projects={projects}
        user={{
          email: user.email!,
          name: user.user_metadata?.name,
        }}
      />
    </div>
  );
}
