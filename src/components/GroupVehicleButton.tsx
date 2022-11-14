import { Text, Pressable, IPressableProps, HStack, Avatar, Icon, VStack, useTheme, Heading } from "native-base";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FontAwesome } from '@expo/vector-icons';

type Props = IPressableProps & {
  name: string
  address: string
  color: string
  size: number
  speed: number
  rpm: number
  status: string
  isActive: boolean
}

export function GroupVehicleButton({
  status, rpm, speed, size, color, name, address, isActive, ...rest }: Props) {
  const { colors } = useTheme();
  //const { speed } = props
  let iconColor = '';
  if (speed > 0) {
    iconColor = colors.green[600]
  } else if (speed === 0) {
    iconColor = colors.red[500];
  } else if (speed === 0 && rpm > 0) {
    iconColor = colors.blue[500];
  } else if (status === 'offline') {
    iconColor = colors.gray[300];
  }

  return (
    <Pressable
      mt={3}
      w={"full"}
      h={20}
      bg='gray.100'
      rounded="md"
      backgroundColor={colors.gray[200]}
      overflow='hidden'
      isPressed={isActive}
      _pressed={{
        borderColor: 'green.500',
        borderWidth: 2
      }}
      {...rest}
    >
      <HStack >

        <Avatar bg="gray.100" size="md" mt={4} ml={2} >
          <Avatar.Badge bg={status === 'online' ? colors.green[600] : colors.red[500]} />

          <VStack>
            <Icon
              name="truck"
              as={FontAwesome}
              color={iconColor}
              size={size}
            />
          </VStack>
        </Avatar>

        <VStack ml={4} flex={1}>
          <Heading p={2} fontSize='lg' color='gray.700'>
            {name}
          </Heading >
          <Text fontSize='sm' color='gray.400' mt={1} ml={2} numberOfLines={2}>
            {address}
          </Text>
        </VStack>
        <Text mr={2} >{rpm} km/h </Text>
      </HStack>

    </Pressable>
  )
}