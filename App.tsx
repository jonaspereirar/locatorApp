import { Text, View, StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#619B8A"
        translucent
      />
      {fontsLoaded ? <Text >Hello word</Text> : <View />}
    </View>
  );
}