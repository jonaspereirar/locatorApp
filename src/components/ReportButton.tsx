import { Button as ButtonNative, IButtonProps, Text } from "native-base"

type Props = IButtonProps & {
  title: string;
  color: string;

}

export function ReportButton({ title, color, ...rest }: Props) {
  return (
    <ButtonNative
      w={40}
      h={14}
      bg={color}
      rounded='md'
      _pressed={{
        bg: 'green.500'
      }}
      {...rest}

    >
      <Text
        color='gray.700'
        fontFamily='heading'
        fontSize='sm'>
        {title}
      </Text>
    </ButtonNative>
  )
}