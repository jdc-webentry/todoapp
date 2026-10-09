export type Priority = "high" | "medium" | "low";
export type Category = "work" | "private" | "other";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  createdAt: number;
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const CATEGORY_LABEL: Record<Category, string> = {
  work: "仕事",
  private: "プライベート",
  other: "その他",
};
