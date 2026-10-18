"use client"; // needed so we can use useState and handle button clicks in the browser

import { useState } from "react";
import TodoItem from "@/components/TodoItem";
import { createTodo, deleteTodo, updateTodo } from "@/lib/todos";
import type { Todo } from "@/types/todo";

type TodoAppProps = {
  initialTodos: Todo[]; // list loaded on the server, then handed to this client component
};

export default function TodoApp({ initialTodos }: TodoAppProps) {
  // useState: when these values change, React re-renders the UI
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from doing a full page reload
    const trimmed = title.trim();
    if (!trimmed) return;

    // 1) save via the API  2) update state so the new task appears straight away
    const newTodo = await createTodo(trimmed);
    setTodos((current) => [...current, newTodo]);

    setTitle("");
    setIsDialogOpen(false);
  }

  // Same pattern as Add: event → API → update state
  async function handleToggle(todo: Todo) {
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    setTodos((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">My To-do List</h1>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {isDialogOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Add a task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-700">
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                  placeholder="e.g. Buy milk"
                  autoFocus
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
