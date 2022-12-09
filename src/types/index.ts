export type UserDTO = {
  id: string;
  name: string;
  email: string;
}

export interface ISignInCredencials {
  email: string;
  password: string;
}

export interface IAuthState {
  user: UserDTO;
  token: string;
}

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}
