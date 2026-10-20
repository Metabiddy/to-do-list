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
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "@/lib/todos";
import { taskSchema, type TaskFormValues } from "@/lib/task-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "@/types/todo";

export default function TodoApp() {
  // Server state: the task list lives on json-server and is cached by TanStack Query
  const {
    data: todos = [],
    refetch,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
  });
  const queryClient = useQueryClient();

  // A mutation changes server data; invalidating "todos" refreshes the list
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

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
      await createMutation.mutateAsync(values.title);

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
      await updateTodo(todo.id, { completed: !todo.completed });
      await refetch();
      setActionError(null);
    } catch {
      setActionError("Could not update the task. Please try again.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodo(id);
      await refetch();
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

      {isPending ? (
        <p className="text-sm text-slate-600">Loading tasks...</p>
      ) : isError ? (
        <p className="text-sm text-destructive" role="alert">
          Could not load tasks. Please try again.
        </p>
      ) : (
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
      )}

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
