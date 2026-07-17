import { Address } from '../auth/auth.model';

export type UserSettings = {
  userId: number;
  fullName: string;
  email: string;
  avatarBase64: string;
  senderAddress: Address;
  defaultPaymentTerms: number;
};

export type UpdateProfileRequest = {
  fullName: string;
  avatarBase64: string;
  senderAddress: Address;
};

export type UpdateInvoicePreferencesRequest = {
  defaultPaymentTerms: number;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};