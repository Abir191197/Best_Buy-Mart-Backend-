// Define the constant for user roles
export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
} as const;

// Derive the type for user roles
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
