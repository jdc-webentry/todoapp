import { NextResponse } from "next/server";
import { get, put } from "@vercel/blob";
import type { Todo } from "@/app/lib/types";

const BLOB_PATHNAME = "todos.json";

export async function GET() {
  const blob = await get(BLOB_PATHNAME, {
    access: "private",
    useCache: false,
  });
  if (!blob) return NextResponse.json([]);

  const text = await new Response(blob.stream).text();
  const todos = JSON.parse(text) as Todo[];
  return NextResponse.json(todos);
}

export async function PUT(request: Request) {
  const todos = (await request.json()) as Todo[];

  await put(BLOB_PATHNAME, JSON.stringify(todos), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ ok: true });
}
