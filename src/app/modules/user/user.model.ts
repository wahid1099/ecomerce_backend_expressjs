// Define User Schema
import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel, UserRole } from "./user.interface";
import config from "../../../config/index";

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    username: { type: String, unique: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: { type: String, required: [true, "Password is required"] },
    profileImage: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    phone: { type: String },
    addressBook: { type: String },
    shop: [{ type: Schema.Types.ObjectId, ref: "Shop" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    followedShops: [{ type: Schema.Types.ObjectId, ref: "Shop" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }], // Reference to Payment model

    role: {
      type: String,
      enum: Object.values(UserRole), // Assuming UserRole enum is defined somewhere
      required: [true, "Role is required"],
    },
    isSuspended: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    lastLoginAt: { type: Date },
    lastLoginDevice: { type: String },
    lastLoginLocation: { type: String },
    passwordChangedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Post-save hook to remove the password from the returned document
userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

// Transform output to remove sensitive fields
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await this.findOne({ email });
};

// Static method to check if the password matches
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Create and export the User model
export const User = model<IUser, IUserModel>("User", userSchema);
