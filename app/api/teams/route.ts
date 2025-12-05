import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { db } from "@/lib/connection";

export async function GET() {
  try {
    await dbConnect();
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

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, company } = await req.json();

    if (!name || !company) {
      return NextResponse.json(
        { success: false, error: "Team name and company are required" },
        { status: 400 }
      );
    }

    // Check if company exists
    let existingCompany = await db.collection("companies").findOne({ name: company });

    // Create company if missing
    if (!existingCompany) {
      const companyInsert = await db.collection("companies").insertOne({
        name: company,
        createdAt: new Date(),
      });

      existingCompany = { _id: companyInsert.insertedId, name: company };
    }

    // Create team
    const team = await db.collection("teams").insertOne({
      name,
      companyId: existingCompany._id,
      companyName: existingCompany.name,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { id: team.insertedId, name, company },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create team" },
      { status: 500 }
    );
  }
}
