import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "team_lead", "developer", "tester", "reader"],
      default: "reader",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;