import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInCredencials {
  username: string;
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
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        "@TLBT:token",
        "@TLBT:user",
      ]);

      if (token[1] && user[1]) {
        axios.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ username, password }: SignInCredencials) => {
    fetch("https://gpsdata.tlbt.pt/api/session", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: JSON.stringify({ username, password })
    }).then((response) => {

      console.log(response.json())
    })

  }, []);

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
