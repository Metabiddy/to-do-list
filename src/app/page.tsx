import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      {/* TodoApp now loads its own data in the browser with useQuery */}
      <TodoApp />
    </main>
  );
}
