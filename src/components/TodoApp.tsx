"use client"; // needed so we can use useState and handle button clicks in the browser

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TodoItem from "@/components/TodoItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createTodo, deleteTodo, updateTodo } from "@/lib/todos";
import { taskSchema, type TaskFormValues } from "@/lib/task-schema";
import type { Todo } from "@/types/todo";

type TodoAppProps = {
  initialTodos: Todo[]; // list loaded on the server, then handed to this client component
};

export default function TodoApp({ initialTodos }: TodoAppProps) {
  // useState: when these values change, React re-renders the UI
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // React Hook Form tracks values + errors; Zod schema checks them
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "" },
  });

  // Only runs after Zod validation passes (via form.handleSubmit)
  async function onAddTask(values: TaskFormValues) {
    try {
      // 1) save via the API  2) update state so the new task appears straight away
      const newTodo = await createTodo(values.title);
      setTodos((current) => [...current, newTodo]);

      form.reset();
      setIsDialogOpen(false);
    } catch {
      // Keep the typed title and dialog open so the user can retry
      form.setError("root", {
        message: "Could not save the task. Please try again.",
      });
    }
  }

  // Same pattern as Add: event → API → update state
  async function handleToggle(todo: Todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setActionError(null);
    } catch {
      setActionError("Could not update the task. Please try again.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((item) => item.id !== id));
      setActionError(null);
    } catch {
      // Keep the task in the list so the user can retry
      setActionError("Could not delete the task. Please try again.");
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">My To-do List</h1>
        <Button type="button" variant="default" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </Button>
      </div>
      {/* app/about/page.tsx maps to the /about URL */}
      <p className="mb-6">
        <Link href="/about" className="text-sm text-teal-700 underline hover:text-teal-800">
          About this app
        </Link>
      </p>

      {actionError && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {actionError}
        </p>
      )}

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

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a task</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onAddTask)}
            className="space-y-4"
          >
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                type="text"
                placeholder="e.g. Buy milk"
                autoFocus
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <FieldError errors={[form.formState.errors.root]} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
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
