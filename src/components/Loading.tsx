import { Center, Spinner } from 'native-base';

export function Loading() {
  return (
    <Center flex={1} mt='1/2' bg="gray.700">
      <Spinner color="green.500" />
    </Center>
  );
}