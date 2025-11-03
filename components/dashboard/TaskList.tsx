"use client";

import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function TaskList({ tasks, members, adminId }: { tasks: any[]; members: any[]; adminId: string }) {
  const { data: session } = useSession();
  const s: any = session;

  async function markComplete(taskId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      toast.success("Marked complete");
      // refresh
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Server error");
    }
  }

  return (
    <div className="space-y-3">
      {tasks.length === 0 && <div className="text-sm text-slate-500">No tasks yet</div>}
      {tasks.map((t) => (
        <div key={t.id} className="p-4 bg-white rounded border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{t.title}</h4>
              <span className="text-xs text-slate-500">{t.status}</span>
            </div>
            {t.description && <p className="text-sm text-slate-500">{t.description}</p>}
            <div className="text-xs text-slate-400 mt-2">Assigned to: {t.assignee ? t.assignee.name : "Unassigned"}</div>
          </div>

          <div className="flex flex-col gap-2">
            {t.status !== "done" && (t.assignedTo === s?.user?.id || t.assignee?.email === s?.user?.email) && (
              <Button size="sm" onClick={() => markComplete(t.id)}>Mark complete</Button>
            )}

            {/* Assign UI for admin */}
            {s?.user?.id === adminId && t.status !== "done" && (
              <AssignControl taskId={t.id} members={members} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AssignControl({ taskId, members }: { taskId: string; members: any[] }) {
  async function assignTo(assigneeId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to assign");
      toast.success("Assigned");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Server error");
    }
  }

  return (
    <select onChange={(e) => assignTo(e.target.value)} className="text-sm rounded border p-1">
      <option value="">Assign to...</option>
      {members.map((m) => (
        <option key={m.user.id} value={m.user.id}>{m.user.name || m.user.email}</option>
      ))}
    </select>
  );
}
