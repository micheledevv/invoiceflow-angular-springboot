export type AuthRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  avatarBase64: string;
};

export type AuthResponse = {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  avatarBase64: string;
};

export type AuthUser = {
  userId: number;
  fullName: string;
  email: string;
  avatarBase64: string;
};