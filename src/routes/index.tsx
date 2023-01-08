import { useTheme, Box, Image, View } from 'native-base'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { Loading } from '@components/Loading';
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';
import { useAuth } from '@hooks/useAuth';

import Background from '@assets/background.png'

export default function Routes() {
  const { user, isLoadingUserStorageData } = useAuth();
  const { colors } = useTheme();


  const theme = DefaultTheme;
  theme.colors.background = colors.green[900]

  if (isLoadingUserStorageData) {
    return <Loading />
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

        {user.id ? <AppRoutes /> : <AuthRoutes />}

      </NavigationContainer>
    </Box>
  )
}