"use client";

import type { Category, Priority } from "@/app/lib/types";
import { CATEGORY_LABEL, PRIORITY_LABEL } from "@/app/lib/types";

type Props = {
  category: Category | "all";
  priority: Priority | "all";
  onCategoryChange: (value: Category | "all") => void;
  onPriorityChange: (value: Priority | "all") => void;
};

const CATEGORIES: (Category | "all")[] = ["all", "work", "private", "other"];
const PRIORITIES: (Priority | "all")[] = ["all", "high", "medium", "low"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-accent text-white"
          : "bg-accent-soft text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({
  category,
  priority,
  onCategoryChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="mb-5 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-muted">カテゴリ</span>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={category === c}
            onClick={() => onCategoryChange(c)}
          >
            {c === "all" ? "すべて" : CATEGORY_LABEL[c]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-muted">優先度</span>
        {PRIORITIES.map((p) => (
          <Chip
            key={p}
            active={priority === p}
            onClick={() => onPriorityChange(p)}
          >
            {p === "all" ? "すべて" : PRIORITY_LABEL[p]}
          </Chip>
        ))}
      </div>
    </div>
  );
}
