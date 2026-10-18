import type { Todo } from "@/types/todo";

// json-server runs on port 3001 (Next.js uses 3000)
const API_URL = "http://localhost:3001/todos";

// "async" means this function returns a Promise — it takes time to finish
// because the network request is not instant
export async function getAllTodos(): Promise<Todo[]> {
  // fetch talks to the API; "await" pauses until the response arrives
  const response = await fetch(API_URL, {
    cache: "no-store", // always get fresh data (do not use a cached copy)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  // response.json() also takes time, so we await it too
  const todos: Todo[] = await response.json();
  return todos;
}

// POST a new to-do to the API; json-server returns the saved object (with id)
export async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  const todo: Todo = await response.json();
  return todo;
}

// PATCH updates some fields on an existing to-do (here: completed)
export async function updateTodo(
  id: number,
  updates: Partial<Pick<Todo, "title" | "completed">>,
): Promise<Todo> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }

  const todo: Todo = await response.json();
  return todo;
}

// DELETE removes a to-do permanently from the fake backend
export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}
