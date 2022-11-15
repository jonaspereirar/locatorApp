import { Button as ButtonNative, Icon, IButtonProps, Text, HStack } from "native-base"
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = IButtonProps & {
  title: string;
  color: string;
  iconColor: string

}

export function ReportButton({ iconColor, title, color, ...rest }: Props) {
  return (
    <ButtonNative
      alignContent='space-around'
      w={40}
      h={14}
      bg={color}
      rounded='md'
      _pressed={{
        bg: 'green.500'
      }}
      {...rest}

    >
      <HStack>
        <Icon
          mr={8}
          name="view-grid-plus"
          style={{ transform: [{ rotateX: '180deg' }] }}
          as={MaterialCommunityIcons}
          color={iconColor}
          size={6}
        />

        <Text
          mr={8}
          color='gray.700'
          fontFamily='heading'
          fontSize='sm'>
          {title}
        </Text>
      </HStack>
    </ButtonNative>
  )
}