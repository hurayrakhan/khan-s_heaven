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
    const { name } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid team name" }, { status: 400 });
    }

    // find user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // create team
    const team = await prisma.team.create({
      data: {
        name,
        createdBy: user.id,
      },
    });

    // add admin as team member
    await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId: team.id,
      },
    });

    return NextResponse.json({ team });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
