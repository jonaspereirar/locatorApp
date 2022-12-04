import "react-native-gesture-handler";
import { View, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import Routes from './src/routes';
import AuthProvider from "@contexts/auth";

import { THEME } from './src/theme'
import { Load } from '@components/Load';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthProvider>
        {fontsLoaded ? <Routes /> : <Load />}
      </AuthProvider>
    </NativeBaseProvider>
  );
}