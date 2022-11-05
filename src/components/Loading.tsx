import { Spinner, Center } from "native-base";

export function Loading() {
  return (
    <Center flex={1} bg="polishedPine.100">
      <Spinner color="pumpkin.100" />
    </Center>
  )
}