/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) return redirect("/login");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return <div>User not found</div>;

    // find teams the user is a member of
    const memberships = await prisma.teamMember.findMany({ where: { userId: user.id }, include: { team: true } });
    const teamIds = memberships.map((m) => m.teamId);

    // aggregate task stats across user's teams
    const totalTasks = await prisma.task.count({ where: { teamId: { in: teamIds } } });
    const completed = await prisma.task.count({
        where: { teamId: { in: teamIds }, status: TaskStatus.done },
    });
    const inProgress = await prisma.task.count({
        where: { teamId: { in: teamIds }, NOT: { status: TaskStatus.done } },
    });

    // unique members count across teams
    const members = await prisma.teamMember.findMany({ where: { teamId: { in: teamIds } }, include: { user: true } });
    const uniqueMemberIds = Array.from(new Set(members.map((m) => m.userId)));

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">Across {teamIds.length} team(s)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgress}</div>
                        <p className="text-xs text-muted-foreground">Tasks not completed yet</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completed}</div>
                        <p className="text-xs text-muted-foreground">Tasks completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueMemberIds.length}</div>
                        <p className="text-xs text-muted-foreground">Unique members across your teams</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
