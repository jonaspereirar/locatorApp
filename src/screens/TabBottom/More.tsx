import { Text, Icon, View, VStack, List } from 'native-base'
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import LogoSvg from '@assets/logo3.svg'
import { useAuth } from '../../hooks/useAuth'

export function More() {
  const { signOut } = useAuth();
  return (
    <>
      <View alignItems='center' mt='20'>
        <LogoSvg width={120} />
      </View>
      <View mt='20' alignItems='center'>

        <List borderColor='transparent' mb='16'>
          <List.Item mb='8'
            onPress={() => {
              Linking.openURL('https://locator.tlbt.pt/terms.html');
            }}
          >
            <Text color='#fff'>
              Termos de Utilização
            </Text>
          </List.Item>

          <List.Item mb='8'
            onPress={() => {
              Linking.openURL('https://locator.tlbt.pt/policy.html');
            }}
          >
            <Text color='#fff'>
              Política de Privacidade
            </Text>
          </List.Item>

          <VStack ml='-6'>
            <List.Item position='absolute' >
              <Text color='#fff' ml='8'>
                Sair
              </Text>
            </List.Item>

            <TouchableOpacity onPress={signOut} style={{ marginLeft: 2, marginTop: 2 }} >
              <Icon as={Feather} name='arrow-left' color='green.400' size={6} />
            </TouchableOpacity>
          </VStack>
        </List>

      </View>
    </>
  )
}