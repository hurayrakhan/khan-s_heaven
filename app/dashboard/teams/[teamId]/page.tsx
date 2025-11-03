import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import AddMemberForm from "@/components/dashboard/AddMemberForm";
import CreateTaskForm from "@/components/dashboard/CreateTaskForm";
import TaskList from "@/components/dashboard/TaskList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  // ensure we have an authenticated user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    // not authenticated -> redirect to login
    redirect("/login");
  }

  const { teamId } = await params;
  if (!teamId) {
    console.error("TeamPage: missing teamId param");
    notFound();
  }

  try {
    // get current user id from DB using email from session
    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email! } });
    const currentUserId = currentUser?.id;

    // fetch team and related data
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { include: { user: true } },
        tasks: { include: { assignee: true } },
      },
    });

    if (!team) {
      // team does not exist -> show helpful message instead of 404 to aid debugging
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Team not found</h2>
          <p className="mt-2 text-sm text-slate-600">No team exists with id: <code>{teamId}</code></p>
        </div>
      );
    }

    // check access: either creator or a member
    const isCreator = currentUserId && team.createdBy === currentUserId;
    const isMember = currentUserId && team.members.some((m) => m.userId === currentUserId);

    if (!isCreator && !isMember) {
      return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Access denied</h2>
            <p className="mt-2 text-sm text-slate-600">You do not have access to this team.</p>
          </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{team.name}</h1>
          <div className="text-sm text-slate-500">Created at: {new Date(team.createdAt).toLocaleString()}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CreateTaskForm teamId={team.id} />

            <TaskList tasks={team.tasks} members={team.members} adminId={team.createdBy} />
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-sm font-medium mb-2">Members</h3>
              <ul className="space-y-2">
                {team.members.map((m) => (
                  <li key={m.id} className="text-sm">
                    {m.user.name} <span className="text-xs text-slate-500">{m.user.email}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-sm font-medium">Add member</h4>
              <AddMemberForm teamId={team.id} />
            </div>
          </aside>
        </div>
      </div>
    );
  } catch (err) {
    console.error("TeamPage: unexpected error", err);
    notFound();
  }
}
