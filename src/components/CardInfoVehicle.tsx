import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text, Heading, } from 'native-base'

interface Props {
  data: {
    rpm: number
    engineTemperature: number
    fuel: number
    Odometro: number
  }
}


export function CardInfoVehicle({ data, ...rest }: Props) {
  const { width } = Dimensions.get('window')

  return (
    <HStack
      w={width}
      mt={1}
      backgroundColor='gray.200'
      borderColor='blue.300'
      borderWidth={2}
      overflow='hidden'
    >
      <Center>
        <VStack
          ml='2'
          mt='2'
          mb='1'
          {...rest}
        >
          <Heading mb={1}>
            Informação CAN
          </Heading>
          <Text color="gray.700" fontSize='sm'>
            Rotações do motor: {data.rpm}{'\n'}
            Temperatura refrigerante do motor: {data.engineTemperature}{'\n'}
            Nível de combustível: {data.fuel}{'\n'}
            Odómetro: {data.Odometro}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}