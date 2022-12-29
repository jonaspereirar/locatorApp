import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { Fab, Icon, NativeBaseProvider, Text, extendTheme, v3CompatibleTheme } from 'native-base';
import { View, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import 'moment/locale/pt';

import { MapMarker } from '../../components/MapMarker';
import { ModalInfoBox } from '@components/ModalInfoBox';

import { PositionsDTO, DeviceDTO } from '../../dtos';
import * as constants from '../../constants/constants';
import { useAuth } from '@hooks/useAuth';

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapProps {
  position: Array<{
    deviceId: string;
    latitude: number;
    longitude: number;
  }>;
  device: Array<{
    id: string;
    name: string;
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
  const [deviceModal, setDeviceModal] = useState({ name: '', lastUpdate: '' });
  const [positionModal, setPositionModal] = useState({
    address: '',
    speed: 0, attributes: { ignition: true }
  });
  const { width, height } = Dimensions.get('window');
  const [position, setPosition] = useState<PositionsDTO[]>([]);
  const [device, setDevice] = useState<DeviceDTO[]>([]);
  const [showsTraffic, setShowsTraffic] = useState(false);
  const [mapType, setMapType] = useState<MapTypes>('standard');
  const [loading, setLoading] = useState(true);
  const [manualZoom, setManualZoom] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [region, setRegion] = useState<IRegion>({
    latitude: calculateAverageCoordinates(position).latitude || 38.76825,
    longitude: calculateAverageCoordinates(position).longitude || -9.4324,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0421,
  });


  const { user } = useAuth();

  useEffect(() => {
    // Atualiza o estado deviceModal a cada 30 segundos
    const interval = setInterval(() => {
      setDeviceModal(deviceModal);
    }, 3000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    // Atualiza o estado positionModal a cada 30 segundos
    const interval = setInterval(() => {
      setPositionModal(positionModal);
    }, 3000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    // Chama a função para buscar as posições dos veículos a cada 30 segundos
    const interval = setInterval(() => {
      loadPositions();
    }, 3000);
    loadListVehicles();
    focusAllVehicles();
    return () => clearInterval(interval);
  }, [])

  function calculateAverageCoordinates(vehicles: PositionsDTO[]) {
    let sumLat = 0;
    let sumLng = 0;

    for (const v of vehicles) {
      sumLat += v.latitude;
      sumLng += v.longitude;
    }
    const avgLat = sumLat / vehicles.length;
    const avgLng = sumLng / vehicles.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
    };
  }

  async function loadListVehicles() {
    try {
      const res = await axios.get(`${constants.API_BASE_URL}/api/devices?userId=${user.id}`)
      setDevice(res.data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPositions() {
    try {
      const res = await axios.get(`${constants.API_BASE_URL}/api/positions`)
      setPosition(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function focusAllVehicles() {
    if (position.length > 0) {
      let minLat = position[0].latitude;
      let maxLat = position[0].latitude;
      let minLng = position[0].longitude;
      let maxLng = position[0].longitude;

      for (const pos of position) {
        minLat = Math.min(minLat, pos.latitude);
        maxLat = Math.max(maxLat, pos.latitude);
        minLng = Math.min(minLng, pos.longitude);
        maxLng = Math.max(maxLng, pos.longitude);
      }

      // Aumenta o valor dos deltas em 50%
      const latitudeDelta = 1.5 * (maxLat - minLat);
      const longitudeDelta = 1.5 * (maxLng - minLng);

      setRegion({
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLng + minLng) / 2,
        latitudeDelta,
        longitudeDelta,
      });
      setManualZoom(false);
    }
  }



  function reposition(
    coordinate: { latitude: number; longitude: number },
    device: { name: string, lastUpdate: string },
    data: { address: string; speed: number; attributes: { ignition: boolean } },
    showModal: boolean) {
    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0421,
    });

    setShowModal(!showModal);
    setDeviceModal({ ...device, lastUpdate: device.lastUpdate });
    setPositionModal(data);
  }
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

  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <View style={{ flex: 1 }}>
        <MapView
          ref={ref => (mapRef = ref)}
          style={{ flex: 1 }}
          onMapReady={onMapReady}
          region={manualZoom ? undefined : region}
          onRegionChangeComplete={(region) => setManualZoom(true)}
          showsTraffic={showsTraffic}
          mapType={mapType}
        >

          {position.map((item, index) => (
            <MapMarker
              key={index}
              device={{
                name: `${device.find((el) => el.id === item.deviceId)?.name}`,
                lastUpdate: `${device.find((el) => el.id === item.deviceId)?.lastUpdate}`,
              }}
              reposition={() => reposition(
                { latitude: item.latitude, longitude: item.longitude },
                {
                  name: `${device.find((el) => el.id === item.deviceId)?.name}`,
                  lastUpdate: `${device.find((el) => el.id === item.deviceId)?.lastUpdate}`
                },
                {
                  address: item.address,
                  speed: item.speed,
                  attributes: item.attributes,
                },
                showModal
              )}
              showModal={showModal}
              width={width}
              height={height}
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
          placement="bottom-right"
          position='absolute'
          onPress={onButtonTrafficClick}
          icon={<Icon color="white" as={MaterialIcons} name="traffic" size="4" />}
        />
        <Fab
          placement="top-left"
          position='absolute'
          onPress={() => onButtonChangeMapClick('hybrid')}
          icon={<Icon color="white" as={MaterialIcons} name="map" size="4" />}
        />
        <Fab
          placement="top-right"
          position='absolute'
          onPress={() => focusAllVehicles()}
          icon={<Icon color="white" as={MaterialCommunityIcons} name="car-multiple" size="4" />}
        />
      </View>
      {position.map((item, index) => (
        <ModalInfoBox
          key={index}
          device={{ name: deviceModal.name }}
          data={{
            address: positionModal.address,
            speed: positionModal.speed,
            ignition: positionModal.attributes.ignition,
            lastUpdate: deviceModal.lastUpdate,


          }}
          height={height}
          width={width}
          show={showModal}
          onClose={() => setShowModal(false)}

        />
      ))}

    </NativeBaseProvider>
  )
}