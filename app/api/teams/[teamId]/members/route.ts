import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request, context: any) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { teamId } = context.params;
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    // only admin can add members
    if (team.createdBy !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email } = body;
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const memberUser = await prisma.user.findUnique({ where: { email } });
    if (!memberUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // check already member
    const existing = await prisma.teamMember.findFirst({ where: { teamId, userId: memberUser.id } });
    if (existing) return NextResponse.json({ error: "User already member" }, { status: 400 });

    const tm = await prisma.teamMember.create({ data: { teamId, userId: memberUser.id } });
    return NextResponse.json({ member: tm });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
