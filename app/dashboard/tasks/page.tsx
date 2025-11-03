import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function MyTasksPage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session || !session.user?.email) {
    return <div>Please sign in to see your tasks.</div>;
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return <div>User not found</div>;

  const tasks = await prisma.task.findMany({ where: { assignedTo: user.id }, include: { assignee: true, team: true } });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>
      <div className="space-y-3">
        {tasks.length === 0 && <div className="text-sm text-slate-500">No assigned tasks</div>}
        {tasks.map((t) => (
          <div key={t.id} className="p-4 bg-white rounded border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t.title}</h3>
                <div className="text-xs text-slate-500">Team: {t.team.name}</div>
                <p className="text-sm text-slate-500">{t.description}</p>
              </div>
              <div className="text-sm text-green-600 font-semibold">{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
