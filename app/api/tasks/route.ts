import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request, context: any) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { teamId, title, description, assignedTo } = body;
    if (!teamId || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // check membership
    const isMember = await prisma.teamMember.findFirst({ where: { teamId, userId: user.id } });
    if (!isMember) return NextResponse.json({ error: "Not a member of team" }, { status: 403 });

    // If assignedTo is provided, ensure caller is admin
  const assigneeId = assignedTo ?? null;
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    if (assignedTo) {
      if (team.createdBy !== user.id) {
        return NextResponse.json({ error: "Only admin can assign tasks" }, { status: 403 });
      }
      // ensure assignee is member
      const member = await prisma.teamMember.findFirst({ where: { teamId, userId: assignedTo } });
      if (!member) return NextResponse.json({ error: "Assignee not a team member" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        teamId,
        assignedTo: assigneeId,
      },
    });

    return NextResponse.json({ task });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
