export interface UsuarioDto {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  isApproved: boolean;
}
