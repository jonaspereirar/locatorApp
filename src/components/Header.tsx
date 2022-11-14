import { HStack, VStack, Center, Text, Box } from 'native-base'

import LogoSvg from '@assets/logo3.svg'

export function Header() {
  return (
    <HStack
      mt={1}
      w={"full"}
      h={24}
      backgroundColor='transparent'
      overflow='hidden'
    >
      <Center>
        <VStack alignContent='space-around' alignItems='center' ml='1/2' mb='1'>
          <Box flex={1}>
            <LogoSvg width={64} />
          </Box>

          <Text color="white" fontSize='sm'>
            Locator
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}