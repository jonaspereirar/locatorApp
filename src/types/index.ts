import { ReactElement, createContext } from 'react';

export interface ICrendentials {
  email: string;
  password: string
}

export interface IAuthContext {
  loading: boolean;
  user: IUser;
  signIn(credentials: ICrendentials): void;
}

export interface IProps {
  children: ReactElement;
}

export const AuthContext = createContext<IAuthContext>(
  {} as IAuthContext,
);

export interface IUser {
  name: string;
  email: string;
}

export interface IAuthState {
  token: string;
  user: IUser;
}