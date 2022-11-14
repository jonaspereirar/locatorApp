import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text, Box, Heading, ITextProps } from 'native-base'
import { VehiclesDTO } from '@dtos/vehiclesDTO'

type Props = ITextProps & {
  name: string
  address: string
  power: number
  fuel: number
  speed: number
  rpm: number
  status: string
  distance: number
  isActive: boolean
  voltmeter: string
  ignition: boolean
}


export function CardInfoHome({
  name, address, power, fuel, speed, rpm, status, distance, isActive, ignition, voltmeter, ...rest }: Props) {
  const { width } = Dimensions.get('window')

  return (
    <HStack
      w={width}
      mt={1}
      h={48}
      backgroundColor='blue.300'
      overflow='hidden'
    >
      <Center>
        <VStack
          ml={5}
          mt={2}
          mb='1'
          {...rest}
        >
          <Heading mb={5} color="white">
            Morada: {address}
          </Heading>
          <Text color="white" fontSize='md'>
            Estado: {status}{'\n'}
            Ignição: {ignition}{'\n'}
            Voltímetro: {voltmeter}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}