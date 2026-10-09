"use client";

import { useRef, useState } from "react";

type Props = {
  onAdd: (input: { text: string; dueDate: string | null }) => void;
};

export default function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, dueDate: dueDate || null });
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

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-fit rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted outline-none transition focus:border-accent focus:text-foreground"
      />
    </form>
  );
}
