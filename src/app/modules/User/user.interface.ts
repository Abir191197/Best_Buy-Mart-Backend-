import { TUserRole } from "./user.constant";

// Define the user interface
export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profileImgSrc: string;
  profileImgSize: number;

  role: TUserRole; // Use the type derived from USER_ROLE
}
export { TUserRole };
