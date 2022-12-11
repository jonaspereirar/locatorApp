import { Center, Text, Icon, View, VStack, List, HStack, extendTheme, v3CompatibleTheme, NativeBaseProvider } from 'native-base'
import { Alert, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth'

export function More() {
  const { signOut } = useAuth();
  return (
    <View mt='auto' alignItems='center'>

      <List borderColor='transparent' mb='16'>
        <List.Item mb='8'
          onPress={() => {
            Linking.openURL('https://locator.tlbt.pt/terms.html');
          }}
        >
          <Text color='white'>
            Termos de Utilização
          </Text>
        </List.Item>

        <List.Item mb='8'
          onPress={() => {
            Linking.openURL('https://locator.tlbt.pt/policy.html');
          }}
        >
          <Text color='white'>
            Política de Privacidade
          </Text>
        </List.Item>

        <VStack ml='-6'>
          <List.Item position='absolute' >
            <Text color='white' ml='8'>
              Sair
            </Text>
          </List.Item>

          <TouchableOpacity onPress={signOut} style={{ marginLeft: 2, marginTop: 2 }} >
            <Icon as={Feather} name='arrow-left' color='green.400' size={6} />
          </TouchableOpacity>
        </VStack>
      </List>

    </View>
  )
}