import { Center, Spinner, Text, View } from 'native-base';
import LogoSvg from '@assets/logo3.svg'

export function Loading() {
  return (
    <>
      <View alignItems='center' mt='20' >
        <LogoSvg width={120} />
        <Text color="#fff" fontSize='sm' position='absolute' mt='24'>
          Locator
        </Text>
      </View>
      <Center flex={1} mt='1/2' bg="gray.700" backgroundColor='transparent'>
        <Spinner color="green.500" />
      </Center>
    </>
  );
}