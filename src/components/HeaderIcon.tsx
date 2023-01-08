import { HStack, VStack, Center, Text, Box } from 'native-base'

import LogoSvg from '@assets/logo3.svg'

export function HeaderIcon() {
  return (
    <HStack
      mt={1}
      w={"full"}
      h={24}
      mb={10}
      backgroundColor='transparent'
      overflow='hidden'
    >
      <Center>
        <VStack alignContent='space-around' alignItems='center' ml='1/2' mb='1'>
          <Box flex={1}>
            <LogoSvg width={64} />
          </Box>

          <Text color="#fff" fontSize='sm'>
            Locator
          </Text>
        </VStack>
      </Center>
    </HStack>
  )
}