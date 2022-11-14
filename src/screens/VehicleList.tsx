import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Center, FlatList, useTheme, Avatar, Heading, Text, Pressable, IPressableProps } from 'native-base'
import { StyleSheet, View, StatusBar } from 'react-native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Header } from '@components/Header';
import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { Load } from '../components/Load';
import { api } from '../services/api'

import { GroupVehicleButton } from '@components/GroupVehicleButton';

interface NavigationProps {
  navigate: (
    screen: string,
    param: {
      vehicle: VehiclesDTO
    }
  ) => void
}

export function VehicleList() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState<VehiclesDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('')

  const navigation = useNavigation<NavigationProps>();

  function handleVehicleDetails(vehicle: VehiclesDTO) {
    navigation.navigate('VehicleDetails', { vehicle })
  }

  useEffect(() => {
    async function loadListVehicles() {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadListVehicles();
  }, [])

  return (
    <View>
      <Header />
      {loading ? <Load /> :
        <FlatList
          bounces={false}
          key='item'
          data={vehicles}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <GroupVehicleButton
              speed={item.speed}
              size={8}
              color={item.color}
              name={item.name}
              address={item.address}
              rpm={item.rpm}
              status={item.status}
              isActive={groupSelected.toLocaleUpperCase() === item.name.toLocaleUpperCase()}
              // onPress={() => setGroupSelected(item.name)}
              onPress={() => handleVehicleDetails(item)}
            />
          }

          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            px: 4,
            //paddingBottom: 10,
            //paddingTop: StatusBar.currentHeight || 0,
            // mb: 20,
            pb: 20,
            backgroundColor: 'transparent',
          }}
          mb={10}
        />
      }
    </View>
  )
}
