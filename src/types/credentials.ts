export interface Credential {
  _id?: string;
  platformName: string;
  usernameOrEmail: string;
  password: string;
  apiKey: string;
  twoFACode: string;
  notes: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCredentialRequest {
  platformName: string;
  usernameOrEmail: string;
  password: string;
  apiKey: string;
  twoFACode: string;
  notes: string;
}

export interface UpdateCredentialRequest extends CreateCredentialRequest {
  _id: string;
}