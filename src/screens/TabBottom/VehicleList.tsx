import { useState, useEffect } from 'react'
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, FlatList, View } from 'native-base'
import axios from 'axios';

import { HeaderIcon } from '@components/HeaderIcon';
import { DeviceDTO, PositionsDTO } from '../../dtos';
import { Loading } from '../../components/Loading';
import { useAuth } from '@hooks/useAuth';

import { GroupVehicleButton } from '@components/GroupVehicleButton';
import * as constants from '../../constants/constants';
import { MapProps } from './Map';

interface Params {
  vehicle: DeviceDTO
  position: PositionsDTO
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}
type AppRoutes = {
  VehicleList: undefined;
  Mapa: MapProps | undefined;
  Mais: undefined;
  VehicleDetails: undefined;
  VehicleDetailsStops: undefined;
  VehicleDetailsTrips: undefined
  VehicleEvents: undefined;
  SmsNotifications: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

export function VehicleList() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<DeviceDTO[]>([]);
  const [positions, setPositions] = useState<PositionsDTO[]>([])

  const { user } = useAuth();

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  useEffect(() => {
    async function loadListVehicles() {
      try {
        const response = await axios.get(`${constants.API_BASE_URL}/api/devices?userId=${user.id}`);
        setVehicles(response.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    loadListVehicles();
  }, [])


  useEffect(() => {
    async function loadPositions() {
      try {
        const res = await axios.get(`${constants.API_BASE_URL}/api/positions`)
        setPositions(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    loadPositions()
  }, [])

  return (
    <View backgroundColor='transparent' mt='8'>
      <HeaderIcon />
      {loading ? <Loading /> : (
        <FlatList
          bounces={false}
          data={positions}
          key={'positions'}
          keyExtractor={(devices, index) => String(index)}
          renderItem={({ item, index }) => (
            <GroupVehicleButton
              device={{
                speed: item.speed,
                name: `${vehicles.find((el) => el.id === item.deviceId)?.name}`,
                address: item.address,
                rpm: item.attributes.rpm,
                status: `${vehicles.find((el) => el.id === item.deviceId)?.status}`,
                isActive: item.attributes.ignition,
              }}
              onPress={() => {
                const foundVehicle = vehicles.find((el) => el.id === item.deviceId);
                if (foundVehicle) {
                  handleVehicleDetails({ vehicle: foundVehicle, position: item });
                }
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            px: 4,
            pb: 20,
            backgroundColor: 'transparent',
          }}
          mb={10}
        />
      )}
    </View>
  )
}
