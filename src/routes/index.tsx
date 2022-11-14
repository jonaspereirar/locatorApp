import { useTheme, Box, Image } from 'native-base'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';

import Background from '@assets/background.png'

export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.green[800]

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
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}