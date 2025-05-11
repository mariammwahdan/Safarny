export interface User {
  uid?: string;
  firstname: string | null;
  lastname: string | null;
  email?: string | null;
  phone: string | null;
  gender?: string | null;
  birthDate?: string | null;
  password?: string;
  confirmPassword?: string;
  role?: string;
}
