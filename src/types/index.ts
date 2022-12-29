import { VehiclesDTO } from "@dtos/vehiclesDTO";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  vehicles: VehiclesDTO;
}

export interface ISignInCredencials {
  email: string;
  password: string;
}

export interface IAuthState {
  user: UserDTO;
}

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}
