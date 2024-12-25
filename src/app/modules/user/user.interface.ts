
import { Model } from "mongoose";

import { Types } from "mongoose";

export enum UserRole {
  Admin = "Admin",
  Vendor = "Vendor",
  Customer = "Customer",
}

export type IUser = {
  _id: string; // UUID, unique identifier
  name: string; // User's full name
  username?: string; // Optional username
  email: string; // Unique email address
  password: string; // Hashed password

  // Address details
  profileImage?: string; // Optional profile image URL
  city?: string; // Optional city
  state?: string; // Optional state
  zipCode?: string; // Optional ZIP/postal code
  country?: string; // Optional country
  phone?: string; // Optional phone number
  addressBook?: string; // Optional address details

  // User roles and status
  role: UserRole; // Restricted to specific roles
  isSuspended: boolean; // True if the account is suspended
  isDeleted: boolean; // True if the account is marked as deleted

  // Tracking login details
  lastLoginAt?: Date; // Last login timestamp
  lastLoginDevice?: string; // Device info (e.g., User-Agent)
  lastLoginLocation?: string; // Location info (e.g., IP-based geolocation)
  passwordChangedAt: Date; // Timestamp when the password was last changed

  // Timestamps
  createdAt: Date; // Timestamp when the user was created
  updatedAt: Date; // Timestamp when the user was last updated

  // Relations
  shop?: Types.ObjectId[]; // Shops owned by the user (if vendor)
  orders?: Types.ObjectId[]; // Orders placed by the user
  reviews?: Types.ObjectId[]; // Reviews written by the user
  followedShops?: Types.ObjectId[]; // Shops the user follows
  shopFollowers?: Types.ObjectId[]; // Followers of the user's shop (if vendor)
  payments?: Types.ObjectId[]; // Payments made by the user
};

export type IUserUpdate = {
  name?: string; // Full name (optional in updates)
  username?: string; // Username (optional in updates)
  email?: string; // Email (optional in updates)
  password?: string; // New password (optional)

  // Address details
  profileImage?: string; // Optional profile image URL
  city?: string; // Optional city
  state?: string; // Optional state
  zipCode?: string; // Optional ZIP/postal code
  country?: string; // Optional country
  phone?: string; // Optional phone number
  addressBook?: string; // Optional address details

  // User roles and status
  role?: UserRole; // Role (optional in updates)
  isSuspended?: boolean; // Suspend or unsuspend the account
  isDeleted?: boolean; // Soft delete the account

  // Tracking updates
  lastLoginAt?: Date; // Optional: Update last login timestamp
  lastLoginDevice?: string; // Optional: Update device info
  lastLoginLocation?: string; // Optional: Update login location
  passwordChangedAt?: Date; // Optional: Update when the password was changed
};

// Extend Mongoose Document to include IUser
interface IUserDocument extends IUser, Document {}

// Define static methods
export interface IUserModel extends Model<IUserDocument> {
  isUserExistByEmail(email: string): Promise<IUserDocument | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
