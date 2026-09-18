export interface AuthResponse {
  success: boolean;
  token: string | null;
  expiration: string;
  username: string | null;
  fullName: string | null;
  email: string | null;
  roles: string[];
  mustChangePassword?: boolean;
  message: string;
}
