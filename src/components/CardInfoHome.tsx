import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text } from 'native-base'

interface Props {

  data: {
    address: string
    lastUpdate: string
    status: string
    speed: number
    attributes: {
      ignition: boolean
      voltmeter: number
    }
  }
}

export function CardInfoHome({
  data, ...rest }: Props) {
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
              última atualização: {data.lastUpdate}
            </Text>
          </VStack>
          <Text mb={3} color="white" fontSize='md'>
            Morada: {data.address}
          </Text>
          <Text color="white" fontSize='sm'>
            Estado: {data.status}{'\n'}
            Ignição: {data.attributes.ignition}{'\n'}
            Voltímetro: {data.attributes.voltmeter}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}