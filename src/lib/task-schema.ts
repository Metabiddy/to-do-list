import { z } from "zod";

// All form rules for "Add Task" live in one place
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
});

// TypeScript type inferred from the schema (no need to write it twice)
export type TaskFormValues = z.infer<typeof taskSchema>;
