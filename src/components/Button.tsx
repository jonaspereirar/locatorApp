import { Button as ButtonNative, IButtonProps, Text } from "native-base"

type Props = IButtonProps & {
  title: string;

}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNative
      w='full'
      h={14}
      bg='green.700'
      rounded='md'
      _pressed={{
        bg: 'green.500'
      }}
      {...rest}

    >
      <Text
        color='white'
        fontFamily='heading'
        fontSize='sm'>
        {title}
      </Text>
    </ButtonNative>
  )
}