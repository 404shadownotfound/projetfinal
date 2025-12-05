import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { db } from "@/lib/connection";

export async function GET() {
  try {
    await dbConnect()
    const teams = await db.collection("teams").find().toArray();

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
