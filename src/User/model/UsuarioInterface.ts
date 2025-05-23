export interface IUser {
  id: string;
  email: string | null;
  password: string | null;
  partnerCode?: string | null;
  partnerId?: string | null;
  meuApelido?: string | null;
  nome?: string | null;
  avatar?: string | null;
  cor?: string | null;
  createdAt: Date;
  updatedAt: Date;
}