export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}
