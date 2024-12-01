import { TUserRole } from "./user.constant";

// Define the user interface
export interface TUser {
  
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
 googleId:string
  Role: TUserRole; // Use the type derived from USER_ROLE
}
export { TUserRole };
