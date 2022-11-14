import { Input as NativeInput, IInputProps } from 'native-base';

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeInput
      h={14}
      px={4}
      bg='transparent'
      rounded='md'
      borderWidth={2}
      borderColor='green.700'
      fontSize='md'
      color='white'
      fontFamily='body'
      mb={6}
      placeholderTextColor='gray.200'
      _focus={{
        bg: 'green.950',
        borderWidth: 2,
        borderColor: 'green.400'
      }}
      {...rest}
    />
  )

}