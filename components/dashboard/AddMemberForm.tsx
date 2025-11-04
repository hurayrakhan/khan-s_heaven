/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddMemberForm({ teamId }: { teamId: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Enter email");
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add member");
      toast.success("Member added");
      setEmail("");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAdd} className="mt-2 flex gap-2">
      <Input placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add"}</Button>
    </form>
  );
}
