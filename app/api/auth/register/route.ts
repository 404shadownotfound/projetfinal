import { NextResponse } from "next/server"
import { createUser } from "@/lib/users"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, confirmPassword, selectedBadge } = body

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser({
      username,
      email,
      password,
      selectedBadge,
    })

    // Return user without password
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          selectedBadge: user.selectedBadge,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register user" },
      { status: 500 }
    )
  }
}
