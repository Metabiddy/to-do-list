// "import type" only brings in a TypeScript type (not real runtime code)
import { Button } from "@/components/ui/button";
import type { Todo } from "@/types/todo";

// Props = the inputs this component receives from its parent
type TodoItemProps = {
  todo: Todo; // one full Todo object (id + title + completed)
  onToggle: (todo: Todo) => void; // parent handles "mark done / not done"
  onDelete: (id: number) => void; // parent handles delete
};

// { todo } pulls the "todo" prop out of the props object (destructuring)
// ": TodoItemProps" tells TypeScript what shape those props must have
export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    // Each string in className is a Tailwind utility (padding, colour, etc.)
    <li className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        className="h-4 w-4 accent-teal-600"
        aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
      />
      {/* completed items get a line-through and muted colour */}
      <span
        className={
          todo.completed
            ? "flex-1 text-slate-400 line-through"
            : "flex-1 text-slate-800"
        }
      >
        {todo.title}
      </span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </Button>
    </li>
  );
}
