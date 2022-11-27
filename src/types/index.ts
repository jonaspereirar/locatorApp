export interface ICrendentials {
  email: string;
  password: string
}

export interface IAuthContext {
  loading: boolean;
  user: IUser;
  signIn(credentials: ICrendentials): void;
  signOut(): void;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IAuthState {
  token: string;
  user: IUser;
}