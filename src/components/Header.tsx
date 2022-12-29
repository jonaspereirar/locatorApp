import { HStack, Text, IPressableProps, Pressable, Icon } from 'native-base'
import LogoSvg from '@assets/logo3.svg'
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
      h='24'
    >
      <Pressable
        {...rest}
      >
        <Icon mt='10' ml='2' as={AntDesign} name='left' color='white' size={6} />
      </Pressable>
      <Text mt='5' ml='1/3' fontSize='xl' color='white'>{name}</Text>


      {/* <Center>
        <VStack alignContent='space-around' alignItems='center' ml='20' mb='1'>
          <Box flex={1}>
            <LogoSvg width={64} />
          </Box>

          <Text color="white" fontSize='sm'>
            Locator
          </Text>
        </VStack>
      </Center> */}
    </HStack>
  )
}