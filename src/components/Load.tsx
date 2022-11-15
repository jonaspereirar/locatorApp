import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'native-base'

export function Load() {
  const theme = useTheme();

  return (
    <ActivityIndicator
      color={theme.colors.green[400]}
      size='large'
      style={{ marginTop: 128, justifyContent: 'center', alignItems: 'center' }}
    />
  )

}