export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}
