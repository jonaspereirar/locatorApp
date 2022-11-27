import { useTheme, Box, Image, View } from 'native-base'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { Load } from '@components/Load';
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';

import { useAuth } from '@contexts/auth';

import Background from '@assets/background.png'

export default function Routes() {
  const { colors } = useTheme();
  const { loading, user } = useAuth();

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
    <Box flex={1} background={colors.green[800]}>
      <Image
        source={Background}
        defaultSource={Background}
        alt="TLBT"
        resizeMode="contain"
        position="absolute"
      />
      <NavigationContainer theme={theme}>

        {user?.id ? <AppRoutes /> : <AuthRoutes />}

      </NavigationContainer>
    </Box>
  )
}