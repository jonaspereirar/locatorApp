import { HStack, Text, IPressableProps, Pressable, Icon } from 'native-base'
import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { AntDesign } from '@expo/vector-icons';

type Props = IPressableProps & {
  name: string
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: {
      name: VehiclesDTO
    }
  ) => void
}
export function Header({ name, ...rest }: Props) {

  return (
    <HStack
      backgroundColor='#008385'
      alignItems='center'
      overflow='hidden'
      w='full'
      h='20'
    >
      <Pressable
        {...rest}
      >
        <Icon mt='8' ml='2' as={AntDesign} name='left' color='white' size={6} />
      </Pressable>
      <Text mt='8' ml='1/3' fontSize='lg' color='white'>{name}</Text>

    </HStack>
  )
}