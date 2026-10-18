import TodoItem from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

// Todo[] means "an array of Todo objects"
// These three items are hard-coded for now (no API yet)
const todos: Todo[] = [
  { id: 1, title: "Learn what a component is", completed: true },
  { id: 2, title: "Pass data with props", completed: false },
  { id: 3, title: "Describe data with a TypeScript interface", completed: false },
];

// This is a React component — a function that returns JSX (HTML-like UI)
export default function Home() {
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
