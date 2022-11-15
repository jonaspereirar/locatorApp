import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text, Heading, } from 'native-base'

interface Props {
  power: number
  fuel: number
  rpm: number
  status: string
  distance: number
  isActive: boolean
}


export function CardInfoVehicle({
  power, fuel, rpm, status, distance, isActive, ...rest }: Props) {
  const { width } = Dimensions.get('window')

  return (
    <HStack
      mt={1}
      w={width}
      h={48}
      backgroundColor='gray.200'
      overflow='hidden'
    >
      <Center>
        <VStack
          ml={8}
          mt={2}
          mb='1'
          {...rest}
        >
          <Heading mb={5}>
            Informação CAN
          </Heading>
          <Text color="gray.700" fontSize='md'>
            Rotações do motor: {rpm}{'\n'}
            Temperatura refrigerante do motor: {power}{'\n'}
            Nível de combustível: {fuel}{'\n'}
            Odómetro: {distance}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}