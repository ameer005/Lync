import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface UserInput extends mongoose.Document {
  email: string;
  name: string;
  username: string;
  password?: string;
  picutre: string;
  adminAccess: boolean;
  accountActivated?: boolean;
  activationCode: string;
  resetPasswordCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends UserInput {
  comparePassword: (candidatePassword: string) => boolean;
  createJwt: () => string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 2,
      max: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      validate: validator.isEmail,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    picutre: {
      type: String,
      default: "",
    },
    adminAccess: {
      type: Boolean,
      default: false,
    },
    accountActivated: {
      type: Boolean,
      default: false,
      select: false,
    },
    activationCode: {
      type: String,
      select: false,
    },
    resetPasswordCode: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// document middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.createJwt = function (days: string) {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET!, {
    expiresIn: days,
  });
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model<UserDocument>("User", userSchema);
