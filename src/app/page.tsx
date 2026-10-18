import TodoApp from "@/components/TodoApp";
import { getAllTodos } from "@/lib/todos";

// Allow this page to wait for uncached API data (fixes the Dev Overlay error)
export const instant = false;

// "async" on a page lets us await API data before rendering
export default async function Home() {
  // Wait for the fake backend to return the to-do array
  const todos = await getAllTodos();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      {/* Pass server-loaded data into the client component as initial state */}
      <TodoApp initialTodos={todos} />
    </main>
  );
}
