import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignInCredencials {
  email: string;
  password: string;
}

interface AuthState {
  user: User;
  token: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credencials: SignInCredencials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

interface IProps {
  children: ReactElement;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthProvider({ children }: IProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    signIn({ email: 'jonasprodrigues@gmail.com', password: '2Yq{SvgXS]x8z8pQ' });
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        "@TLBT:token",
        "@TLBT:user",
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredencials) => {
    fetch("https://gpsdata.tlbt.pt/api/session", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.ok) {
          console.log('SUCCESS')
        } else {
          console.log('NOT Successful')
        }
        return res.json()
      })
      .then(data => console.log(data))
      .catch(error => console.log('ERROR'))

  }, []);

  // const getUser = async () => {
  //   const response = await fetch("https://gpsdata.tlbt.pt/api/session");
  //   const data = await response.json();
  //   console.log(data)
  // }

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@TLBT:token", "@TLBT:user"]);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem("@TLBT:user", JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, signOut, updateUser, }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// import { Alert } from 'react-native';
// import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ReactElement, createContext } from 'react';
// import { IAuthContext, ICrendentials, IUser, IAuthState } from '../types';


// const tokenData = '@tlbtProfile:token';
// const userData = '@tlbtProfile:user'

// interface IProps {
//   children: ReactElement;
// }

// const AuthContext = createContext<IAuthContext>(
//   {} as IAuthContext,
// );

// export const AuthProvider: FunctionComponent<IProps> = ({ children }) => {
//   const [data, setData] = useState<IAuthState>({} as IAuthState)
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function loadAuthData() {
//       const token = await AsyncStorage.getItem(tokenData);
//       const user = await AsyncStorage.getItem(userData);

//       if (token && user) {
//         setData({ token, user: JSON.parse(user) })
//       }
//     }
//     loadAuthData();
//   }, [])

//   function signIn({ email, password }: ICrendentials) {
//     setLoading(true);
//     const item = { email, password }
//     try {
//       fetch('http://10.0.2.2:3333', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//         },
//         body: JSON.stringify(item),
//       }).then((response) =>
//         response.json()).then(json => {
//           setData(json)
//           console.log(json)
//         })
//     } catch (error) {
//       Alert.alert(
//         'Erro na autenticacao',
//         'Ocorreu erro na autorizacao'
//       )
//     }
//     setLoading(false);
//   }

//   async function signOut() {
//     await AsyncStorage.removeItem(tokenData);
//     await AsyncStorage.removeItem(userData);

//     setData({} as IAuthState);
//   }

//   return (
//     <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth(): IAuthContext {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// }