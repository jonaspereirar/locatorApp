import { Dimensions } from 'react-native'
import { HStack, VStack, Center, Text } from 'native-base'
import { PositionsDTO } from '@dtos/PositionsDTO'
import { VehiclesDTO } from '@dtos/vehiclesDTO'

interface Props {

  position: {
    address: string,
    speed: number;
    attributes: {
      ignition: string,
      power: number
    }
  };
  vehicle: {
    name: string;
    status: string,
    lastUpdate: string;
  };
}

export function CardInfoHome({
  position, vehicle, ...rest }: Props) {
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
              Velocidade: {position.speed}
            </Text>
            <Text color="white" fontSize='sm' ml='40' mt='-6'>
              última atualização: {vehicle.lastUpdate}
            </Text>
          </VStack>
          <Text mb={3} color="white" fontSize='sm'>
            Morada: {position.address}
          </Text>
          <Text color="white" fontSize='sm'>
            Estado: {vehicle.status}{'\n'}
            Ignição: {position.attributes.ignition}{'\n'}
            Voltímetro: {position.attributes.power}
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}