"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProgressChart from "@/app/components/ProgressChart";
import TodoForm from "@/app/components/TodoForm";
import TodoItem from "@/app/components/TodoItem";
import type { Todo } from "@/app/lib/types";

const POLL_INTERVAL_MS = 5000;

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function persistTodos(todos: Todo[]) {
  await fetch("/api/todos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todos),
  });
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMutatingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (isMutatingRef.current) return;
      const data = await fetchTodos();
      if (!cancelled) setTodos(data);
    };

    refresh().finally(() => {
      if (!cancelled) setIsLoaded(true);
    });

    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const applyChange = (next: Todo[]) => {
    setTodos(next);
    isMutatingRef.current = true;
    persistTodos(next).finally(() => {
      isMutatingRef.current = false;
    });
  };

  const addTodo = (input: { text: string; dueDate: string | null }) => {
    applyChange([
      {
        id: crypto.randomUUID(),
        text: input.text,
        completed: false,
        dueDate: input.dueDate,
        createdAt: Date.now(),
      },
      ...todos,
    ]);
  };

  const toggleTodo = (id: string) => {
    applyChange(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    applyChange(todos.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">ToDo</h1>
          <ProgressChart total={todos.length} completed={completedCount} />
        </header>

        <TodoForm onAdd={addTodo} />

        {!isLoaded ? (
          <p className="py-10 text-center text-sm text-muted">読み込み中...</p>
        ) : todos.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            タスクはまだありません。
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </main>
  );
}
