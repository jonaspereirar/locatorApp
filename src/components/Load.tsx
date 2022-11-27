import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme, View } from 'native-base'

export function Load() {
  const { colors } = useTheme();
  const theme = useTheme();

  return (
    <View background={colors.green[800]} width='full' height='full'>
      <ActivityIndicator
        color={theme.colors.green[400]}
        size='large'
        style={{ backgroundColor: 'transparent', marginTop: 128, justifyContent: 'center', alignItems: 'center' }}
      />
    </View>
  )

}