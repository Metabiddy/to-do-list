// "import type" only brings in a TypeScript type (not real runtime code)
import type { Todo } from "@/types/todo";

// Props = the inputs this component receives from its parent
type TodoItemProps = {
  todo: Todo; // one full Todo object (id + title + completed)
};

// { todo } pulls the "todo" prop out of the props object (destructuring)
// ": TodoItemProps" tells TypeScript what shape those props must have
export default function TodoItem({ todo }: TodoItemProps) {
  return (
    // Each string in className is a Tailwind utility (padding, colour, etc.)
    <li className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
      <span className="text-teal-600" aria-hidden="true">
        {todo.completed ? "✓" : "○"}
      </span>
      {/* completed items get a line-through and muted colour */}
      <span
        className={
          todo.completed ? "text-slate-400 line-through" : "text-slate-800"
        }
      >
        {todo.title}
      </span>
    </li>
  );
}
