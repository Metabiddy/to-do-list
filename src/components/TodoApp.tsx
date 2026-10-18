"use client"; // needed so we can use useState and handle button clicks in the browser

import Link from "next/link";
import { useState } from "react";
import TodoItem from "@/components/TodoItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="mb-2 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">My To-do List</h1>
        <Button type="button" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </Button>
      </div>
      {/* app/about/page.tsx maps to the /about URL */}
      <p className="mb-6">
        <Link href="/about" className="text-sm text-teal-700 underline hover:text-teal-800">
          About this app
        </Link>
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Done</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-slate-700">
              Title
              <Input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1"
                placeholder="e.g. Buy milk"
                autoFocus
              />
            </label>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
