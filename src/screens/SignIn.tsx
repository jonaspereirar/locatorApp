import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LogoSvg from '@assets/logo3.svg'
import Background from '@assets/background.png'
import { Input } from "@components/Imput";
import { Button } from "@components/Button";

export function SignIn() {

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccont() {
    navigation.navigate('signIn');
  }


  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>

        <Image
          source={Background}
          defaultSource={Background}
          alt="TLBT"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg width={120} />

          <Text color="white" fontSize='sm' ml={-16} mt={-8}>
            Locator
          </Text>

        </Center>

        <Center>
          <Heading color='gray.200' fontSize='xl' mb={6} fontFamily='heading'>
            Acesse sua conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Senha"
            secureTextEntry
          />

          <Button title="Acessar"></Button>
        </Center>

      </VStack>
    </ScrollView>
  );
}