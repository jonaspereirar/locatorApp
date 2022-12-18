import React, { useState, useEffect } from 'react'
import MapView from 'react-native-maps';
import { Fab, Icon, NativeBaseProvider, extendTheme, v3CompatibleTheme } from 'native-base'
import { View, Animated, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import RenderInfo from '@components/RenderInfo';
import moment from 'moment';
import 'moment/locale/pt';

import { MapMarker } from '../../components/MapMarker';

import { PositionsDTO, DeviceDTO } from '../../dtos';
import { api } from '../../services/api'
import { useAuth } from '@hooks/useAuth';

interface IRegion {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number
}

export interface MapProps {
  position: Array<{
    deviceId: string,
    latitude: number,
    longitude: number,
  }>;
  device: Array<{
    id: string,
    name: string,
  }>;
}
type MapTypes =
  | 'standard'
  | 'satellite'
  | 'hybrid'
  | 'terrain'
  | 'none'
  | 'mutedStandard';

export function Map() {
  const { width, height } = Dimensions.get('window');
  const bottomHeight = height / 2;
  const [translateY] = useState(new Animated.Value(bottomHeight));
  const [region, setRegion] = useState<IRegion>({ latitude: 38.76825, longitude: -9.4324, latitudeDelta: 0.0322, longitudeDelta: 0.0421, });
  const [position, setPosition] = useState<PositionsDTO[]>([]);
  const [device, setDevice] = useState<DeviceDTO[]>([]);
  const [showsTraffic, setShowsTraffic] = useState(false);
  const [mapType, setMapType] = useState<MapTypes>('standard');

  const [loading, setLoading] = useState(true)

  const { user } = useAuth();

  useEffect(() => {

    loadListVehicles();
    loadPositions()

  }, [])

  async function loadListVehicles() {
    try {
      const res = await api.get(`/api/devices?userId=${user.id}`);
      setDevice(res.data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPositions() {
    try {
      const res = await api.get('/api/positions')
      setPosition(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const reposition = (coordinate: any) => {
    setRegion({
      ...region,
      ...coordinate,
    });
    setPosition(position);
    show();
  };
  const onMapReady = () => {
    if (mapRef) {
      mapRef.fitToElements();
    }
  };
  let mapRef: MapView | null = null;

  function onButtonTrafficClick() {
    setShowsTraffic(!showsTraffic)
  }

  const onButtonChangeMapClick = (newMapType: MapTypes) => {

    if (mapType === 'standard') {
      newMapType = 'hybrid';
    }
    if (mapType === 'hybrid') {
      newMapType = 'standard';
    }
    setMapType(newMapType);
  };

  function show() {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }


  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          showsMyLocationButton
          provider="google"
          onMapReady={onMapReady}
          region={region}
          showsTraffic={showsTraffic}
          mapType={mapType}
        >

          {position.map((item) => (
            <MapMarker
              key={`key_${item.deviceId}`}
              device={{ name: `${device.find((el) => el.id === item.deviceId)?.name}` }}
              reposition={(item) => reposition(position.find((item) => item.latitude, item.longitude))}
              position={{
                latitude: item.latitude,
                longitude: item.longitude,
                course: item.course,
                speed: item.speed,
                rpm: item.attributes.rpm,
              }}
            />
          ))}
        </MapView>

        <Fab
          style={{ marginBottom: 150 }}
          placement="bottom-left"
          onPress={onButtonTrafficClick}
          icon={<Icon color="white" as={MaterialIcons} name="traffic" size="4" />}
        />
        <Fab
          style={{ marginBottom: 80 }}
          placement="bottom-left"
          onPress={() => onButtonChangeMapClick('hybrid')}
          icon={<Icon color="white" as={MaterialIcons} name="map" size="4" />}
        />
        <Fab
          style={{ marginBottom: 10 }}
          placement="bottom-left"
          onPress={() => show()}
          icon={<Icon color="white" as={MaterialCommunityIcons} name="car-multiple" size="4" />}
        />
      </View>
    </NativeBaseProvider>
  )
}