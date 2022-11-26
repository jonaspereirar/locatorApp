import { useTheme, Box, Image, View } from 'native-base'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { Load } from '@components/Load';
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';

import { AuthProvider, useAuth } from '../context/AuthContext';

import Background from '@assets/background.png'

export default function Routes() {
  const { colors } = useTheme();
  const { loading, signIn } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.green[800]

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Load />
      </View>
    );
  }
  return (
    <Box flex={1}>
      <Image
        source={Background}
        defaultSource={Background}
        alt="TLBT"
        resizeMode="contain"
        position="absolute"
      />
      <NavigationContainer theme={theme}>
        <AuthProvider>
          {signIn ? <AppRoutes /> : <AuthRoutes />}
        </AuthProvider>
      </NavigationContainer>
    </Box>
  )
}