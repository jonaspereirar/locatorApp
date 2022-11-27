import { Alert } from 'react-native';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ReactElement, createContext } from 'react';
import { IAuthContext, ICrendentials, IUser, IAuthState } from '../types';
import { api } from '@services/api';

const tokenData = '@tlbtProfile:token';
const userData = '@tlbtProfile:user'

interface IProps {
  children: ReactElement;
}

const AuthContext = createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: FunctionComponent<IProps> = ({ children }) => {
  const [data, setData] = useState<IAuthState>({} as IAuthState)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAuthData() {
      const token = await AsyncStorage.getItem(tokenData);
      const user = await AsyncStorage.getItem(userData);

      if (token && user) {
        setData({ token, user: JSON.parse(user) })
      }
    }
    loadAuthData();
  }, [])

  async function signIn({ email, password }: ICrendentials) {
    setLoading(true);
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });
      console.log(response.data)
      const { token, user } = response.data
      await AsyncStorage.setItem(tokenData, token)
      await AsyncStorage.setItem(userData, JSON.stringify(user))
      setData({ token, user })
    } catch (error) {
      Alert.alert(
        'Erro na autenticacao',
        'Ocorreu erro ao fazer login, verifique suas credenciais'
      )
    }
    setLoading(false);
  }

  async function signOut() {
    await AsyncStorage.removeItem(tokenData);
    await AsyncStorage.removeItem(userData);

    setData({} as IAuthState);
  }

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}