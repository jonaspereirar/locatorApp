import { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { NativeBaseProvider, extendTheme, v3CompatibleTheme, View } from 'native-base'

import { MapMarker, IMapState } from '../../components/MapMarker';

import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api'
import { useAuth } from '@hooks/useAuth';

export function Map() {
  const [position, setPosition] = useState([{ latitude: 0, longitude: 0 }]);
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<VehiclesDTO[]>([]);

  const { user } = useAuth();
  const route = useRoute();

  useEffect(() => {
    async function loadListVehicles() {
      try {
        const resVehicles = await api.get(`/api/devices?userId=${user.id}`);
        const resPositions = await api.get('/api/positions')
        setPosition(resPositions.data)
        console.log(resPositions.data)
        setVehicles(resVehicles.data);
        console.log(resVehicles.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadListVehicles();
  }, [])


  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          provider="google"
        >

        </MapView>
      </View>
    </NativeBaseProvider>
  )
}
