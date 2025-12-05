import bcrypt from "bcryptjs"
import dbConnect from "./mongodb"
import User, { IUser } from "@/models/User"
import { Types } from "mongoose"

export interface UserData {
  id: string
  username: string
  email: string
  password: string
  score?: number
  team: Types.ObjectId
  createdAt: string
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserData | null> {
  try {
    await dbConnect()
    const user = await User.findOne({ email: email.toLowerCase() }).lean()
    
    if (!user) return null
    
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      team: user.team,
      score: user.score,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<UserData | null> {
  try {
    await dbConnect()
    const user = await User.findById(id).lean()
    
    if (!user) return null
    
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      score: user.score,
      team: user.team,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Create new user
export async function createUser(userData: {
  username: string
  email: string
  password: string
  selectedBadge?: number
}): Promise<UserData> {
  try {
    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create new user
    const newUser = new User({
      username: userData.username,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      score: 0,
      team: userData.selectedBadge,
    })
    await newUser.save()

    return {
        id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      team: newUser.team,
      score: newUser.score,
      createdAt: newUser.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update user
export async function updateUser(
  id: string,
  updates: Partial<Omit<UserData, "id" | "email" | "password" | "createdAt">>
): Promise<UserData | null> {
  try {
    await dbConnect()
    
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean()

    if (!user) return null

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      score: user.score,
      team: user.team,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Update user progress
export async function updateUserProgress(
  id: string,
  levelId: number,
  xpEarned: number
): Promise<UserData | null> {
  try {
    await dbConnect()
    
    const user = await User.findById(id)
    if (!user) return null
    
    // Add XP
    user.score += xpEarned
    
    await user.save()

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      password: user.password,
      team: user.team,
        score: user.score,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error updating user progress:", error)
    return null
  }
}

// Get leaderboard (top users by XP)
export async function getLeaderboard(limit: number = 10): Promise<Omit<UserData, "password">[]> {
  try {
    await dbConnect()
    
    const users = await User.find()
      .select("-password")
      .sort({ xp: -1 })
      .limit(limit)
      .lean()

    return users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      score: user.score,
        team: user.team,
      createdAt: user.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    return []
  }
}
