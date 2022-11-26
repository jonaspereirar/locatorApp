import { Input as NativeInput, IInputProps, FormControl } from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const Invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={Invalid} mb={6}>
      <NativeInput
        h={14}
        w={'full'}
        px={4}
        bg='transparent'
        rounded='md'
        borderWidth={2}
        borderColor='green.700'
        fontSize='md'
        color='white'
        fontFamily='body'
        placeholderTextColor='gray.200'
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500'
        }}
        _focus={{
          bg: 'green.950',
          borderWidth: 2,
          borderColor: 'green.400'
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )

}