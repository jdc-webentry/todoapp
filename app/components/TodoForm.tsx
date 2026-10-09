"use client";

import { useRef, useState } from "react";
import type { Category, Priority } from "@/app/lib/types";
import { CATEGORY_LABEL, PRIORITY_LABEL } from "@/app/lib/types";

type Props = {
  onAdd: (input: {
    text: string;
    priority: Priority;
    category: Category;
    dueDate: string | null;
  }) => void;
};

const PRIORITIES: Priority[] = ["high", "medium", "low"];
const CATEGORIES: Category[] = ["work", "private", "other"];

export default function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, priority, category, dueDate: dueDate || null });
    setText("");
    setDueDate("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="mb-6 flex flex-col gap-3"
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          追加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none transition focus:border-accent"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              優先度: {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none transition focus:border-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              カテゴリ: {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted outline-none transition focus:border-accent focus:text-foreground"
        />
      </div>
    </form>
  );
}
