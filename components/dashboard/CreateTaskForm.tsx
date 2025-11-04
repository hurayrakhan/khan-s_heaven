/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
// Using native textarea as there's no shadcn textarea component in this repo
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateTaskForm({ teamId }: { teamId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, title: title.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create task");
      toast.success("Task created");
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-sm font-medium mb-2">Create Task</h3>
      <form onSubmit={handleCreate} className="space-y-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full rounded border p-2 text-sm" />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Task"}</Button>
        </div>
      </form>
    </div>
  );
}
