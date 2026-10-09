"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProgressChart from "@/app/components/ProgressChart";
import TodoForm from "@/app/components/TodoForm";
import FilterBar from "@/app/components/FilterBar";
import TodoItem from "@/app/components/TodoItem";
import type { Category, Priority, Todo } from "@/app/lib/types";

const STORAGE_KEY = "simple-todo:todos";

function normalize(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry, index) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    const priority =
      item.priority === "high" ||
      item.priority === "medium" ||
      item.priority === "low"
        ? item.priority
        : "medium";
    const category =
      item.category === "work" ||
      item.category === "private" ||
      item.category === "other"
        ? item.category
        : "other";
    return {
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      text: typeof item.text === "string" ? item.text : "",
      completed: !!item.completed,
      priority,
      category,
      dueDate: typeof item.dueDate === "string" ? item.dueDate : null,
      createdAt:
        typeof item.createdAt === "number" ? item.createdAt : -index,
    };
  });
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">(
    "all"
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // 保存データをマウント後に一度だけ読み込むため、effect内でのsetStateは意図的
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setTodos(normalize(JSON.parse(saved)));
    } catch {
      // localStorageが使えない場合は空の状態で続行
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 保存に失敗しても無視する
    }
  }, [todos, isLoaded]);

  const addTodo = (input: {
    text: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
  }) => {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: input.text,
        completed: false,
        priority: input.priority,
        category: input.category,
        dueDate: input.dueDate,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter(
    (t) =>
      (categoryFilter === "all" || t.category === categoryFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter)
  );

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">ToDo</h1>
          <ProgressChart total={todos.length} completed={completedCount} />
        </header>

        <TodoForm onAdd={addTodo} />

        <FilterBar
          category={categoryFilter}
          priority={priorityFilter}
          onCategoryChange={setCategoryFilter}
          onPriorityChange={setPriorityFilter}
        />

        {filteredTodos.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            {todos.length === 0
              ? "タスクはまだありません。"
              : "条件に合うタスクがありません。"}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {filteredTodos.map((todo) => (
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
