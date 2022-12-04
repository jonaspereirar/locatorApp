import React, { useContext, useState } from "react";
import { Alert, Platform } from "react-native";
import { VStack, Image, Text, Center, Heading, ScrollView, KeyboardAvoidingView } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

import LogoSvg from '@assets/logo3.svg'
import Background from '@assets/background.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@contexts/auth";



type FormDataProps = {
  email: string;
  password: string
}

const signInSchema = yup.object({
  email: yup.string()
    .required('Informe seu email.')
    .email('E-mail inválido.'),
  password: yup.string()
    .required('Informe sua senha.')
})

export function SignIn() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  });

  const { signIn, loading } = useAuth()

  async function handleSignIn(form: FormDataProps) {
    const data = {
      email: form.email,
      password: form.password,
    }
    try {
      signIn(data);
    } catch (eeror) {
      Alert.alert(
        'Erro na autenticacao',
        'Ocorreu erro ao fazer login, verifique suas credenciais'
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        backgroundColor='transparent'
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

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button
              disabled={loading}
              onPress={handleSubmit(handleSignIn)}
              title="Acessar"
            />

          </Center>

        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}