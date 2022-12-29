import { Controller, useForm } from 'react-hook-form';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast, useTheme } from "native-base";

import { useAuth } from '@hooks/useAuth';

import LogoSvg from '@assets/logo3.svg'
import Background from '@assets/background.png'

import { AppError } from '@utils/AppError';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from 'react';


type FormData = {
  email: string;
  password: string;
}

export function SignIn() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false)

  const { singIn } = useAuth();
  const toas = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await singIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente.'

      toas.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      backgroundColor='transparent'
    >
      <VStack flex={1} px={10} pb={16} backgroundColor={colors.green[800]}>
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
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}