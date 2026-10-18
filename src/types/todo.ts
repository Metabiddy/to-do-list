// An "interface" is a TypeScript blueprint for an object's shape.
// It does not exist at runtime — it only helps the editor catch mistakes.
export interface Todo {
  id: number; // unique number for this to-do
  title: string; // the text shown on screen
  completed: boolean; // true = done, false = still to do
}
