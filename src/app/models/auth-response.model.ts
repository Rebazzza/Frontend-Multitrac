export interface AuthResponse {
  success: boolean;
  token: string;
  expiration: string;
  username: string;
  fullName: string;
  roles: string[];
  message: string;
}
