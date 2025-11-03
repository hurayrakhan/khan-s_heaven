"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function CreateTeamPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a team name");
    setLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create team");
      toast.success("Team created");
      router.push(`/dashboard/teams/${data.team.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create a new team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Team name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing Team" />
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create team"}
          </Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
