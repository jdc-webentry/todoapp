"use client";

import { motion } from "framer-motion";
import type { Todo } from "@/app/lib/types";
import { CATEGORY_LABEL, PRIORITY_LABEL } from "@/app/lib/types";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatDueDate(dueDate: string) {
  const [, month, day] = dueDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function isOverdue(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${dueDate}T00:00:00`) < today;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const overdue = !todo.completed && !!todo.dueDate && isOverdue(todo.dueDate);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-2.5 transition hover:border-accent/40"
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "未完了にする" : "完了にする"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          todo.completed
            ? "border-accent bg-accent text-white"
            : "border-muted/60"
        }`}
      >
        {todo.completed && (
          <motion.svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3 w-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.415l2.793 2.793 6.793-6.793a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        )}
      </button>

      <div className="flex-1">
        <span
          className={`block truncate text-sm transition ${
            todo.completed ? "text-muted line-through" : "text-foreground"
          }`}
        >
          {todo.text}
        </span>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: `var(--priority-${todo.priority})`,
              backgroundColor: `var(--priority-${todo.priority}-soft)`,
            }}
          >
            優先度: {PRIORITY_LABEL[todo.priority]}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: `var(--category-${todo.category})`,
              backgroundColor: `var(--category-${todo.category}-soft)`,
            }}
          >
            {CATEGORY_LABEL[todo.category]}
          </span>
          {todo.dueDate && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                overdue
                  ? "bg-[var(--priority-high-soft)] text-[var(--priority-high)]"
                  : "bg-accent-soft text-muted"
              }`}
            >
              期限: {formatDueDate(todo.dueDate)}
              {overdue && "（期限切れ）"}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
        className="shrink-0 rounded-lg p-1.5 text-muted opacity-0 transition hover:bg-accent-soft hover:text-foreground group-hover:opacity-100"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </motion.li>
  );
}
