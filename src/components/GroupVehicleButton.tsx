import { Text, Pressable, IPressableProps, HStack, Avatar, Icon, VStack, useTheme, Heading, Image } from "native-base";

import { FontAwesome } from '@expo/vector-icons';
import { DeviceDTO } from "@dtos/deviceDTO";
import { PositionsDTO } from "@dtos/PositionsDTO";
import flagIcon from '@assets/icon-pt.png'

type Props = IPressableProps & {
  device: {
    name: string
    address: string
    speed: number
    rpm: number
    status: string
    isActive: boolean
  }
  onPress: (device: DeviceDTO, position: PositionsDTO) => void
}

export function GroupVehicleButton({
  device, ...rest }: Props) {
  const { colors } = useTheme();
  let iconColor = '';
  if (device.speed > 0) {
    iconColor = colors.green[600]
  } else if (device.speed === 0) {
    iconColor = colors.red[500];
  } else if (device.speed === 0 && device.rpm > 0) {
    iconColor = colors.blue[500];
  } else if (device.status === 'offline') {
    iconColor = colors.gray[300];
  }

  return (
    <Pressable
      mt={3}
      w={"full"}
      h={20}
      bg='gray.100'
      rounded="md"
      backgroundColor={colors.gray[100]}
      overflow='hidden'
      isPressed={device.isActive}
      _pressed={{
        borderColor: 'green.500',
        borderWidth: 2
      }}
      {...rest}
    >
      <HStack >

        <Avatar bg="gray.100" size="md" mt={4} ml={2} >
          <Avatar.Badge bg={device.status === 'online' ? colors.green[600] : colors.red[500]} />

          <VStack>
            <Icon
              name="truck"
              as={FontAwesome}
              color={iconColor}
              size={8}
            />
          </VStack>
        </Avatar>

        <VStack ml={4} flex={1}>
          <Heading p={2} fontSize='lg' color='gray.700'>
            {device.name}
          </Heading >
          <HStack >
            <Image
              source={flagIcon}
              defaultSource={flagIcon}
              alt="PT"
              size='6'
            />
            <Text fontSize='sm' color='gray.400' mt={-2} ml={2} numberOfLines={2}>
              {device.address}
            </Text>
          </HStack>
        </VStack>
        <Text mr={2} >{device.speed} km/h </Text>
      </HStack>

    </Pressable>
  )
}