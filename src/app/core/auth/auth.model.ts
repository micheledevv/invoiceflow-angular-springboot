export type Address = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type AuthRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  avatarBase64: string;
  senderAddress: Address;
};

export type AuthResponse = {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  avatarBase64: string;
  senderAddress: Address;
};

export type AuthUser = {
  userId: number;
  fullName: string;
  email: string;
  avatarBase64: string;
  senderAddress: Address;
};