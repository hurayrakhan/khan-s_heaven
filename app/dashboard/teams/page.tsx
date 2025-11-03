import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TeamsPage() {
  // server component
  // get teams for current user via session
  // we'll use getServerSession so we can redirect if unauthenticated
  // but since this is a server component under protected layout, we'll fetch teams directly
  const teams = await prisma.team.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <Link href="/dashboard/teams/create">
          <button className="rounded bg-[#1E3A34] px-3 py-2 text-white">Create team</button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <Link key={t.id} href={`/dashboard/teams/${t.id}`} className="block">
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">{t.name}</div>
                  <div className="text-xs text-slate-500">Created: {new Date(t.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-slate-400">Members: {/* render count server-side? */}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
