import TodoItem from "@/components/TodoItem";
import { getAllTodos } from "@/lib/todos";

// Allow this page to wait for uncached API data (fixes the Dev Overlay error)
export const instant = false;

// "async" on a page lets us await API data before rendering
export default async function Home() {
  // Wait for the fake backend to return the to-do array
  const todos = await getAllTodos();

  return (
    // className uses Tailwind utility classes instead of a separate CSS file
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          My To-do List
        </h1>
        <ul className="space-y-3">
          {/* map = loop over the array and render one TodoItem per todo */}
          {/* key helps React track each row; todo={todo} passes the prop */}
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
    </main>
  );
}
