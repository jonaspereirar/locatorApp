import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text } from 'native-base'

interface Props {
  address: string
  lastUpdate: string
  speed: number
  status: string

  data: {
    ignition: boolean
    speed: number
    voltmeter: number
  }
}

export function CardInfoHome({
  address, speed, lastUpdate, status, data, ...rest }: Props) {
  const { width } = Dimensions.get('window')

  return (
    <HStack
      w={width}
      mt={1}
      backgroundColor='blue.300'
      overflow='hidden'
    >
      <Center>
        <VStack
          ml='2'
          mt='2'
          mb='1'
          {...rest}
        >
          <VStack>
            <Text color="white" fontSize='sm' mb='1'>
              Velocidade: {data.speed}
            </Text>
            <Text color="white" fontSize='sm' ml='40' mt='-6'>
              última atualização: {lastUpdate}
            </Text>
          </VStack>
          <Text mb={3} color="white" fontSize='md'>
            Morada: {address}
          </Text>
          <Text color="white" fontSize='sm'>
            Estado: {status}{'\n'}
            Ignição: {data.ignition}{'\n'}
            Voltímetro: {data.voltmeter}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}