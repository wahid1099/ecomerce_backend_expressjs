import { IPayment } from "../Payment/payment.interface";
import { IShop, IShopFollower } from "../shop/shop.interface";
import { IOrder } from "../Orders/order.interface";
import { IReview } from "../reviews/review.interface";

export type IUser = {
  id: string; // UUID, unique identifier
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
  shops?: IShop[]; // Shops owned by the user (if vendor)
  orders?: IOrder[]; // Orders placed by the user
  reviews?: IReview[]; // Reviews written by the user
  followedShops?: IShopFollower[]; // Shops the user follows
  shopFollowers?: IShop[]; // Followers of the user's shop (if vendor)
  payments?: IPayment[]; // Payments made by the user
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

export enum UserRole {
  Admin = "Admin",
  Vendor = "Vendor",
  Customer = "Customer",
}
