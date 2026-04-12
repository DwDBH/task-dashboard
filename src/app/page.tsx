import { getTasks } from "@/lib/store";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  const tasks = getTasks();

  return (
    <main className="min-h-screen">
      <Dashboard tasks={tasks} />
    </main>
  );
}
