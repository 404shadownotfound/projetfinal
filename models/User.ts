import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  team: mongoose.Types.ObjectId
  score: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    score: {
      type: Number,
      min: 0,
      default: 0,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
  },
  {
    timestamps: true,
  }
)

// Create index for faster email lookups
UserSchema.index({ email: 1 })

// Create index for leaderboard queries (sorted by XP)
UserSchema.index({ xp: -1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
